'use strict'

const { model, Schema, Model } = require("mongoose")

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'


const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        // unique: true,
        ref: 'Shop',
        //index: true - use index to limit the number of documents it must scan
    },
    publicKey: {
        type: String,
        require: true
    },
    privateKey: {
        type: String,
        require: true
    },
    refreshTokenUsed: { // stores all refreshToken has been used
        type: [String],
        default: []
    },
    refreshToken: { // stores the current being used 
        type: String,
        require: true
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, keyTokenSchema)