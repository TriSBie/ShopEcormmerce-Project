'use strict'

const keyModel = require("../models/key.model");
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            //level 0

            // publicKey is bufferType => transfers to String 
            // const publicKeyString = publicKey.toString();

            // const tokens = await keyModel.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey : null

            //level xxx
            console.log({ userId })
            const filter = {
                user: userId
            }

            const update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }

            const options = {
                upsert: true, new: true
            }

            //findOneAndUpdate is atomic -> not changed until save() or upsert 
            const tokens = await keyModel.findOneAndUpdate(
                filter, update, options
            )
            return tokens ? tokens.publicKey : null;
        } catch (err) {
            console.log(err)
            return err
        }
    }
}

module.exports = KeyTokenService