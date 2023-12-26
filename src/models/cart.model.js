'use strict'

const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = "Cart"
const COLLECTION_NAME = "Carts"

const cartModelSchema = new Schema({
    cart_state: {
        type: String,
        enum: ["active", "completed", "pending", "failed"],
        default: 'active'
    },
    cart_products: {
        type: Array, default: [], require: true
    },
    /** EXAMPLE 
     * [
     *  {
     *      productId,
     *      shopId,
     *      quantity,
     *      price,
     *      name
     *  }
     * ]
     */
    cart_product_count: {
        type: Number,
        default: 0
    },
    cart_userId: {
        type: Number, require: true
        //  update later
    }
},
    {
        collection: COLLECTION_NAME,
        timestamps: true
    }
)

module.exports = model(DOCUMENT_NAME, cartModelSchema);