const { Schema, model } = require("mongoose");
const { default: slugify } = require("slugify");

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
    product_slug: String, // quan-jean-cao-cap
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
    },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must from / above 1.0"],
        max: [5, "Rating must less / equal 5.0"],
        set: (val) => Math.round(val * 10 / 10)
    },
    product_variation: {
        type: Array, default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
    },
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})

//  create text-index for full-text search operation
productSchema.index({
    product_name: 'text',
    product_description: 'text'
})

//  Document middleware : run before .save() and .create()
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, { lower: true });
    next()
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
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
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