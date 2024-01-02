'use strict'

const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model")
const { getProductById } = require("../models/repository/product.repo")

class InventoryService {
    static async addStockToInventory({
        product_id,
        stock,
        shopId,
        location = 'abc 123 ho chi minh city'
    }) {
        const product = await getProductById(product_id);
        if (!product) {
            throw new BadRequestError("Product has not been found [inventory]")
        }

        //  add into inventory
        const query = {
            inven_shopId: shopId,
            inven_productId: product._id
        }, update = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }, options = {
            upsert: true,
            new: true
        }

        return await inventoryModel.findOneAndUpdate(query, update, options);
    }
}

module.exports = InventoryService