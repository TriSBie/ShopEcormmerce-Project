'use strict'

const { Mongoose, model, Schema, Collection } = require('mongoose')
const DOCUMENT_NAME = 'Notification'
const COLLECTION_NAME = 'Notifications'

// ORDER-001 : order successfully
// ORDER-002 : order failed
// PROMOTION-001 : new promotion
// SHOP-001 : new Product by user

const notificationSchema = new Schema({
    noti_type: { type: String, enum: ['ORDER-001', 'ORDER-002', 'PROMOTION-001', 'SHOP-001'] },
    noti_senderId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    noti_receiverId: {
        type: Number,
    },
    noti_content: {
        type: String,
        default: ''
    },
    noti_options: {
        type: Object,
        default: {}
    }
},
    {
        timestamps: true,
        collection: COLLECTION_NAME
    });

module.exports = model(DOCUMENT_NAME, notificationSchema)