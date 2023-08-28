'use strict'

const { model, Schema, Model } = require("mongoose")

const DOCUMENT_NAME = 'Key'
const COLLECTION_NAME = 'Keys'


const keyTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        // unique: true,
        ref: 'Shop',
        //index: true - use index to limit the number of documents it must scan
    },
    publicKey: {
        type: String,
        required: true
    },
    privateKey: {
        type: String,
        required: true
    },
    refreshToken: { //apply for detech token
        type: Array,
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(COLLECTION_NAME, keyTokenSchema)