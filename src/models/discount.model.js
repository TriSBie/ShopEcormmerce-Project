'use strict'

const { Schema, model } = require("mongoose");

const DOCUMENT_NAME = "Discount"
const COLLECTION_NAME = "Discounts"

const discountSchema = new Schema({
	discount_name: { type: String, require: true },
	discount_description: { type: String, require: true },
	discount_type: { type: String, default: 'fixed_amount' }, // percentage
	discount_value: { type: Number, require: true },
	discount_code: { type: String, require: true },
	discount_start_date: { type: Date, require: true },
	discount_end_date: { type: Date, require: true },
	discount_maximum_uses_amount: { type: Number, require: true }, //	the number of discount allowed been used
	discount_uses_count: { type: Number, require: true }, // the number of discount has been used
	discount_user_used_info: { type: Array, default: [] }, // collection of the user who has used the discount
	discount_maximum_use_per_user: { type: Number, require: true }, // maximum total amount of discount for the apply allowed by a personal 
	discount_minimum_order_value: { type: Number, require: true },
	discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' }, // use for searching products belong to a specific shop
	discount_is_active: { type: Boolean, default: true },
	discount_applies_to: { type: String, require: true, enum: ['all', 'specific'] },
	discount_product_ids: { type: Array, default: [] } // number of products are allowed for the discount applying
}, {
	timestamps: true,
	collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, discountSchema);