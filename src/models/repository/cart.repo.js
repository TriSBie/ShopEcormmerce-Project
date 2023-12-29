const { convertStringToObjectId } = require("../../utils")
const cartModel = require("../cart.model")

const findCartById = async (cartId) => {
    return await cartModel.findOne({
        _id: convertStringToObjectId(cartId),
        cart_state: 'active'
    }).lean()
}

module.exports = { findCartById } 