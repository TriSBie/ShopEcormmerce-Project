'use strict'

const { SuccessResponses } = require("../core/success.response");
const ProductFactory = require("../services/product.services.xxx");

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

    getAllDaftProduct = async (req, res) => {
        new SuccessResponses({
            message: 'Get all draft products successfully',
            metadata: await ProductFactory.findAllDraftForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getAllPublishedProduct = async (req, res) => {
        new SuccessResponses({
            message: 'Get all published products successfully',
            metadata: await ProductFactory.findAllPublishedForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    publishedProductByShop = async (req, res) => {
        new SuccessResponses({
            message: 'Change published status of products successfully',
            metadata: await ProductFactory.publishProductById({
                product_shop: req.user.userId,
                product_id: req.params['id']
            })
        }).send(res)
    }

    unpublishedProductByShop = async (req, res) => {
        new SuccessResponses({
            message: 'Change published status of products successfully',
            metadata: await ProductFactory.unPublishProductById({
                product_shop: req.user.userId,
                product_id: req.params['id']
            })
        }).send(res)
    }

    getAllProduct = async (req, res) => {
        new SuccessResponses({
            message: 'Get all products successfully',
            metadata: await ProductFactory.searchByText({
                keySearch: req.params['keySearch']
            })
        }).send(res)
    }

}

module.exports = new ProductController()