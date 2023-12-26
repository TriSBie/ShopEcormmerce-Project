'use strict'

const { SuccessResponses } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
    addToCart = async (req, res) => {
        new SuccessResponses({
            message: "Add new product to cart successfully",
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    deleteProductInCart = async (req, res) => {
        new SuccessResponses({
            message: "Add new product to cart successfully",
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    updateCart = async (req, res) => {
        new SuccessResponses({
            message: "Add new product to cart successfully",
            metadata: await CartService.addToCartV2({
                userId: req.body.userId,
                shop_order_ids: req.body.shop_order_ids
            })
        }).send(res)
    }

    getListProduct = async (req, res) => {
        new SuccessResponses({
            message: "Get cart by user id successfully",
            metadata: await CartService.getListUserCart(req.params.userId)
        }).send(res)
    }
}

module.exports = new CartController();