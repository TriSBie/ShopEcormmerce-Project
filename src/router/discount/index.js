const express = require("express")
const router = express.Router()

const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const discountController = require("../../controllers/discount.controller")


//  anonymous user have permission/ access to view simple info of discount
router.post("/get-discount-amount", asyncHandler(discountController.getDiscountAmount))
router.get("/list-products-code", asyncHandler(discountController.getAllProductsByDiscountCode))

router.use(authenticationV2);
router.post("/create-discount-code", asyncHandler(discountController.createDiscountCode))
router.get("/list-discount-by-shop", asyncHandler(discountController.getAllDiscountCodeByShop))
// router.post("/discount-amount", asyncHandler(discountController.getDiscountAmount))
// router.get("")

module.exports = router