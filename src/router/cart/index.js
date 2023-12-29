'use strict'

const express = require("express")
const router = express.Router()

const { asyncHandler } = require("../../helpers/asyncHandler")
const cartController = require("../../controllers/cart.controller")


router.post("", asyncHandler(cartController.addToCart));
router.get("/:userId", asyncHandler(cartController.getListProduct))
router.delete("/delete-product-cart", asyncHandler(cartController.deleteProductInCart));
router.post("/update-cart", asyncHandler(cartController.updateCart));

module.exports = router