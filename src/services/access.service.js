'use strict'

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const shopModel = require("../models/shop.model");
const KeyTokenService = require("./keytoken.services");
const createTokenPair = require("../auth/authUtils");
const { getInfoData } = require("../utils/index")


const shopROLES = {
    SHOP: 'SHOP',
    WRITER: 'WRITER', // must replace by number
    EDITOR: 'EDITOR'  // must replace by number
}

class AccessService {
    static signUp = async ({ name, email, password }) => {
        try {
            //step check the existence of email
            const holderShop = await shopModel.findOne({ email }).lean();

            if (holderShop) {
                //confirm that email has already exists in database
                return {
                    code: 'xxx',
                    message: 'Shop has already existed'
                }
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

                //return publicKey from the token has created
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return {
                        code: 'xxx',
                        message: 'keyStore error'
                    }
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
                    userId: newShop._id,
                    email
                }, publicKey, privateKey);

                console.log({ tokens })

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