'use strict'

const { SuccessResponses } = require("../core/success.response");
const ProductFactory = require("../services/product.services");

class ProductController {

    createProduct = async (req, res) => {
        const { type, payload } = req.body
        console.log({ type, payload });
        new SuccessResponses({
            message: 'Create new product successfully',
            metadata: await ProductFactory.createProduct(type, payload)
        }).send(res)
    }

}

module.exports = new ProductController()