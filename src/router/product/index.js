'use strict'

const express = require("express")
const router = express.Router()
const productController = require("../../controllers/product.controller")
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")

//  anonymous user can view all products
router.get("/get-all-product/:keySearch", asyncHandler(productController.searchProductsByText))
router.post("", asyncHandler(productController.findAllProduct));
router.post("/get-product-by-id/:shopId", asyncHandler(productController.findProduct));



//  authentication - check accessToken is legitable or not - prevent a sabotage
router.use(authenticationV2)
router.post('/create', asyncHandler(productController.createProduct))

router.put('/update-published/:id', asyncHandler(productController.publishedProductByShop))
router.put('/update-unpublished/:id', asyncHandler(productController.unpublishedProductByShop))


router.get("/draft/all", asyncHandler(productController.getAllDaftProduct))
router.get("/published/all", asyncHandler(productController.getAllPublished))

router.patch("/update-product/:product_id", asyncHandler(productController.updateProduct))
module.exports = router