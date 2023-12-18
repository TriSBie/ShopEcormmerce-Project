const { ExplainVerbosity } = require("mongodb");
const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Product"
const COLLECTION_NAME = "Products"

const productSchema = new Schema({
    product_name: {
        type: String,
        require: true,
    },
    product_thumb: {
        type: String,
        require: true
    },
    product_description: String,
    product_price: {
        type: Number,
        require: true
    },
    product_quantity: {
        type: Number,
        require: true
    },
    product_type: {
        type: String,
        require: true,
        enum: ["Electronic", "Clothing", "Furniture"],
    },
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})
const DOCUMENT_NAME_CLOTHING = 'Clothe'
const DOCUMENT_NAME_ELECTRONIC = 'Electronic'
const DOCUMENT_NAME_FURNITURE = 'Furniture'


//  define attributes type = Clothing
const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }

}, {
    collection: 'Clothes',
    timestamps: true
})

//  define attributes type = Electronic
const electronicSchema = new Schema({
    manufacturer: { type: String, require: true },
    model: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'Electronics',
    timestamps: true
})

//  define attributes type = Furniture
const furnitureSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'Furnitures',
    timestamps: true
})

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model(DOCUMENT_NAME_CLOTHING, clothingSchema),
    furniture: model(DOCUMENT_NAME_FURNITURE, furnitureSchema),
    electronic: model(DOCUMENT_NAME_ELECTRONIC, electronicSchema)
}