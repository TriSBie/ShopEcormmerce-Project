'use strict'

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keytoken.services");
const { getInfoData } = require("../utils/index");
const { BadRequestError, AuthFailureError, ForbiddenError } = require("../core/error.response");
const { findByEmail } = require("./shop.service");
const { createTokenPair, verify, verifyJWT } = require("../auth/authUtils");


const shopROLES = {
    SHOP: 'SHOP',
    WRITER: 'WRITER', // must replace by number
    EDITOR: 'EDITOR'  // must replace by number
}

//all method of services class should be static
class AccessService {


    /** ---------REFRESH-----------
     * check this token used ?
     * 
     */
    static handlerRefreshToken = async (refreshToken) => {
        const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken); //check from the refreshTOkenUsed
        //check foundToken is expired/ used or not
        if (foundToken) {
            //since we putted refreshToken with payload data -> using privateKey to verify data
            const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey);
            console.log(`[1]===: `, { userId, email });
            //remove all token from keyStore
            await KeyTokenService.deleteKeyById(userId)
            throw new ForbiddenError('Something went wrong ! Please re-login again !')
        }

        const holderToken = await KeyTokenService.findByRefreshToken({ refreshToken });
        if (!holderToken) {
            throw new AuthFailureError('Shop is not registered!');
        }

        //verifyToken 
        const { userId, email } = await verifyJWT(refreshToken, holderToken.privateKey)
        console.log(`[2]===: `, { userId, email })
        //check userID
        const foundShop = await findByEmail(email);
        if (!foundShop) {
            throw AuthFailureError('Shop is not registered')
        }

        //create new pair of tokens
        const token = await createTokenPair({
            userId, email
        }, holderToken.publicKey, holderToken.privateKey);

        await holderToken.updateOne({
            refreshToken: token.refreshToken,
            refreshTokenUsed: refreshToken

        })
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

        /** Generate tokens - (payload, publicKey, privateKey)  */
        const tokens = await createTokenPair({
            userId: foundShop._id,
            email
        }, publicKey, privateKey)

        await KeyTokenService.createKeyToken({ //add into database with findOneAndUpdate
            userId: foundShop._id,
            refreshToken: tokens.refreshToken,
            publicKey, privateKey
        })

        return {
            shop: getInfoData({ fields: ["_id", "name", "email"], object: foundShop }),
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
            //step check the existence of email
            const holderShop = await shopModel.findOne({ email }).lean();

            if (holderShop) {
                //confirm that email has already exists in database (DUPLICATED)

                //IF BAD REQUEST
                return new BadRequestError('Shop has already registered !').getNotice()
                // return {
                //     code: 'xxx', //409 Error conflict
                //     message: 'Shop has already existed'
                // }
            }
            const hashPassword = await bcrypt.hash(password, 10);
            const newShop = await shopModel.create({ name, email, password: hashPassword, roles: shopROLES['SHOP'] })

            if (newShop) {
                // create accessToken and refreshToken
                // create privateKey (verify token), publicKey (stores in local)
                // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1', //pkcs8
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })
                // NEW VERSION CREATE PRIVATE KEY
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                // Public key Cryptography Standards

                console.log({ privateKey, publicKey });

                //return publicKey from the token has created after added into mongoDB
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return new BadRequestError('KeyStore occured error').getNotice();
                    // return {
                    //     code: 'xxx',
                    //     message: 'keyStore error'
                    // }
                }

                // if (!publicKeyString) {
                //     return {
                //         code: 'xxx',
                //         message: 'publicKeyString error'
                //     }
                // }

                // console.log(`Public key string :: ${publicKeyString}`)

                // const publicKeyObject = crypto.createPublicKey(publicKeyString)

                // create tokens
                const tokens = await createTokenPair({
                    //payload
                    userId: newShop._id,
                    email
                }, publicKey, privateKey); //return accessToken, refreshToken

                await KeyTokenService.createKeyToken({
                    refreshToken: tokens.refreshToken,
                    privateKey, publicKey
                },)

                return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fields: ['name', 'email', 'password'], object: newShop }),
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