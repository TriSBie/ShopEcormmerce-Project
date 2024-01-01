const { Type } = require("mongoose")
const inventoryModel = require("../inventory,model")
const { convertStringToObjectId } = require("../../utils")

const insertInventory = async ({ productId, shopId, location = 'unknown', stock }) => {
    return await inventoryModel.create({
        inven_productId: productId,
        inven_location: location,
        invent_shopId: shopId,
        inven_stock: stock
    })
}

//  check and minus quantity in reservation inventory
const reservationInventory = async ({ productId, quantity, cartId }) => {
    const query = {
        inven_productId: convertStringToObjectId(productId),
        inven_stock: { $gte: quantity }
    },
        update = {
            $inc: {
                inven_stock: -quantity
            },
            $push: {
                inven_reservations: {
                    quantity,
                    cartId,
                    createOn: new Date()
                }
            }
        },
        options = {
            upsert: true,
            new: true
        }
    return await inventoryModel.updateOne(query, update, options);
}

module.exports = { insertInventory, reservationInventory }