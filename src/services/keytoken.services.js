'use strict'

const keyModel = require("../models/key.model");

const { Types } = require("mongoose");
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
    static findById = async (userId) => {
        //cast string to Type Object Id
        return await keyModel.findOne({ user: new Types.ObjectId(userId) });
    }

    static removeKeyById = async (id) => {
        return await keyModel.findByIdAndDelete(id)
    }

    static findByRefreshTokenUsed = async (refreshkey) => {
        return await keyModel.findOne({ refreshTokenUsed: refreshkey })
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyModel.findOne({ refreshToken: refreshToken })
    }

    static deleteKeyById = async (userId) => {
        return await keyModel.findByIdAndDelete({ user: userId })
    }
}

module.exports = KeyTokenService