const { Type } = require("mongoose")
const inventoryModel = require("../inventory,model")

const insertInventory = async ({ productId, shopId, location = 'unknown', stock }) => {
    return await inventoryModel.create({
        inven_productId: productId,
        inven_location: location,
        invent_shopId: shopId,
        inven_stock: stock
    })
}

module.exports = { insertInventory }