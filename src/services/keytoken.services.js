'use strict'

const keyModel = require("../models/key.model");
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey }) => {
        try {
            // publicKey is bufferType => transfers to String 
            const publicKeyString = publicKey.toString();

            const tokens = await keyModel.create({
                user: userId,
                publicKey,
                privateKey
            })

            return tokens ? tokens.publicKey : null
        } catch (err) {
            console.log(err)
            return err
        }
    }
}

module.exports = KeyTokenService