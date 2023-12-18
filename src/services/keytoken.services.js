'use strict'

const keyModel = require("../models/key.model");

const { Types } = require("mongoose");
// generate refreshedKey and handy function of key's services
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            const filter = {
                user: userId
            }
            const update = {
                publicKey, privateKey, refreshTokenUsed: [], refreshToken
            }
            const options = {
                upsert: true, new: true
            }
            // findOneAndUpdate is atomic -> not changed until save() or upsert 
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

    //  check whether refreshedToken has been used or not
    static findByRefreshTokenUsed = async (refreshKey) => {
        console.log("refreshKey: ", refreshKey)
        return await keyModel.find({ refreshTokenUsed: refreshKey }).lean()
    }

    static findByRefreshToken = async (refreshToken) => {
        return await keyModel.findOne({ refreshToken: refreshToken })
    }

    static deleteKeyById = async (userId) => {
        return await keyModel.findByIdAndDelete({ user: userId })
    }
}

module.exports = KeyTokenService