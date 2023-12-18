'use strict'

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keytoken.services");
const { getInfoData } = require("../utils/index");
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const { createTokenPair, verifyJWT } = require("../auth/authUtils");

const shopROLES = {
    SHOP: 'SHOP',
    WRITER: 'WRITER', // must replace by number
    EDITOR: 'EDITOR'  // must replace by number
}

//all method of services class should be static
class AccessService {

    /** ---------REFRESH-----------
     * check this token be used ?
     */

    static handlerRefreshToken = async (refreshToken) => {

        //  get all available list of refreshToken used
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken);
        console.log("foundToken: ", foundToken);

        if (foundToken.length !== 0) {
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
            console.log(`[Data parsed from JWT]====: `, { userId, email });
            //  Clear all refreshKeyUsed stored in database
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something went wrong ! Please re-login again !')
        }

        const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
        if (!holderToken) {
            throw new AuthFailureError('Shop is not registered!');
        }

        // Encrypted data from jwt
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        const foundShop = await findByEmail({ email });

        if (!foundShop) {
            throw new AuthFailureError('Shop is not registered')
        }

        //  re-create new pair of tokens
        const token = await createTokenPair({
            userId, email
        }, holderToken.publicKey, holderToken.privateKey);

        await holderToken.updateOne({
            refreshToken: token.refreshToken,
            refreshTokenUsed: refreshToken
        })

        return {
            shop: getInfoData({ fields: ["_id", "name", "email"], object: foundShop }),
            token
        }
    }

    /**----------LOGOUT-----------
     * 1 - check permission
     * 2 - check refreshToken from logge in whether matches with token has created or not ?
     * 3 - clear all access + api + refreshKey
     */

    static logout = async ({ keyStore }) => {
        return await KeyTokenService.removeKeyById(keyStore._id)
    }

    /** -----------LOGIN--------------
     * 1 - check email is existed ?
     * 2 - match password 
     * 3 - create AT and RT and save
     * 4 - generates tokens
     * 5 - get data and return login
     */

    static login = async ({ email, password, refreshToken = null }) => {
        const foundShop = await findByEmail({ email });
        console.log("========= Found shop : ", foundShop);

        /** Find shop by email */
        if (!foundShop) {
            return new BadRequestError('Shop not registered yet!').getNotice()
        }

        /** Compare password with hashed password being stored in db */
        const match = bcrypt.compare(password, foundShop.password);
        if (!match) {
            return new AuthFailureError('Authentication error').getNotice()
        }

        /** Create publicKey and privateKey */
        const publicKey = crypto.randomBytes(64).toString('hex');
        const privateKey = crypto.randomBytes(64).toString('hex');

        /** Generate tokens - (payload, publicKey, privateKey) - return PUBLIC KEY  */
        const tokens = await createTokenPair({
            userId: foundShop._id,
            email
        }, publicKey, privateKey)

        // find and update accessKey
        await KeyTokenService.createKeyToken({
            userId: foundShop._id,
            refreshToken: tokens.refreshToken,
            publicKey, privateKey
        })

        return {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: foundShop
            }),
            tokens
        }
    }

    /** --------------SIGN UP --------------
     * 1 - Check email is registed or not ?
     * 2 - create hash password
     * 3 - create pair of tokens
    */

    static signUp = async ({ name, email, password }) => {
        try {
            //  step check the existence of email
            const holderShop = await shopModel.findOne({ email }).lean();
            console.log({ holderShop });
            if (holderShop) {
                // confirm that email has already exists in database (DUPLICATED)

                // IF BAD REQUEST - ALREADY REGISTERED
                return new BadRequestError('Shop has already registered !').getNotice()
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({ name, email, password: hashPassword, roles: shopROLES['SHOP'] })

            if (newShop) {
                // NEW VERSION CREATE PRIVATE KEY
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                // Public key Cryptography Standards

                console.log({ privateKey, publicKey });

                // return publicKey from the token has created after added successful
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return new BadRequestError('KeyStore occured error').getNotice();
                }

                // create tokens - return [accessToken, refreshToken]
                const tokens = await createTokenPair({
                    // payload
                    userId: newShop._id,
                    email
                }, publicKey, privateKey);

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ object: newShop, fields: ['name', 'email', 'password'] }),
                        tokens: tokens,
                    }
                }
            }
            return {
                code: 200,
                metadata: null
            }
        } catch (err) {
            return {
                code: 'xxx',
                message: err.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService