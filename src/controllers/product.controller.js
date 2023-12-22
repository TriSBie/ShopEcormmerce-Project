'use strict'

const { SuccessResponses } = require('../core/success.response')
const ProductFactory = require('../services/product.services.xxx')

class ProductController {
	createProduct = async (req, res) => {
		const { type, payload } = req.body
		const configPayload = {
			...payload,
			product_shop: req?.user?.userId
		}
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
				product_id: req.params.id
			})
		}).send(res)
	}

	unpublishedProductByShop = async (req, res) => {
		new SuccessResponses({
			message: 'Change published status of products successfully',
			metadata: await ProductFactory.unPublishProductById({
				product_shop: req.user.userId,
				product_id: req.params?.id
			})
		}).send(res)
	}

	searchProductsByText = async (req, res) => {
		new SuccessResponses({
			message: 'Search all products successfully',
			metadata: await ProductFactory.searchByText({
				keySearch: req.params?.keySearch
			})
		}).send(res)
	}

	findAllProduct = async (req, res) => {
		new SuccessResponses({
			message: 'Get all products successfully',
			metadata: await ProductFactory.findAllProducts({})
		}).send(res)
	}

	findProduct = async (req, res) => {
		new SuccessResponses({
			message: 'Get a product successfully',
			metadata: await ProductFactory.findProduct({
				product_id: req.params?.shopId
			})
		}).send(res)
	}

	updateProduct = async (req, res) => {
		const productId = req.params.product_id
		new SuccessResponses({
			message: 'Update data product successfully',
			metadata: await ProductFactory.updateProductById({
				type: req?.body?.product_type,
				productId,
				payload: {
					...req.body,
					product_shop: req?.user.userId
				}
			})
		}).send(res)
	}
}

module.exports = new ProductController()
