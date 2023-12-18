'use strict'

const { SuccessResponses } = require("../core/success.response");
const ProductFactory = require("../services/product.services");

class ProductController {

    createProduct = async (req, res) => {
        const { type, payload } = req.body
        const configPayload = {
            ...payload,
            product_shop: req?.user?.userId
        }
        console.log({ type, payload });
        new SuccessResponses({
            message: 'Create new product successfully',
            metadata: await ProductFactory.createProduct(type, configPayload)
        }).send(res)
    }

}

module.exports = new ProductController()