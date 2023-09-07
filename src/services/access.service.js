'use strict'

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keytoken.services");
const createTokenPair = require("../auth/authUtils");
const { getInfoData } = require("../utils/index");
const { BadRequestError, AuthFailureError } = require("../core/error.response");
const { findByEmail } = require("./shop,service");


const shopROLES = {
    SHOP: 'SHOP',
    WRITER: 'WRITER', // must replace by number
    EDITOR: 'EDITOR'  // must replace by number
}

//all method of services class should be static
class AccessService {

    static logOut = async ({ }) => {

    }

    /**
     * 1 - check email is existed ?
     * 2 - match password 
     * 3 - create AT and RT and save
     * 4 - generates tokens
     * 5 - get data and return login
     * @param {*} param0 
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

        /** Generate tokens */
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