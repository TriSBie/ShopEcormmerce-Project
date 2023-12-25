'use strict'

const { SuccessResponses } = require("../core/success.response");
const discountModel = require("../models/discount.model");
const DiscountService = require("../services/discount,.service");

class DiscountController {
    createDiscountCode = async (req, res) => {
        new SuccessResponses({
            message: "Create new discount code successfully",
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId: req?.user?.userId
            })
        }).send(res)
    }

    getAllDiscountCodeByShop = async (req, res) => {
        new SuccessResponses({
            message: "Get discounts code by shopId successfully",
            metadata: await DiscountService.getAllDiscountCodeByShop({
                limit: req?.params.limit,
                page: req?.params.page,
                shopId: req?.user?.userId
            })
        }).send(res)
    }

    getAllProductsByDiscountCode = async (req, res) => {
        new SuccessResponses({
            message: "Create new discount code successfully",
            metadata: await DiscountService.getProductsByDiscountCode({
                ...req.body,
                shopId: req?.user?.userId
            })
        }).send(res)
    }

    getDiscountAmount = async (req, res) => {
        new SuccessResponses({
            message: "Get discount amount successfully",
            metadata: await DiscountService.getDiscountAmount({
                ...req.body,
                shopId: req?.user?.userId
            })
        }).send(res)
    }

    deleteDiscountCode = async (req, res) => {
        new SuccessResponses({
            message: "Create new discount code successfully",
            metadata: await DiscountService.deleteDiscountCode({
                ...req.body,
                shopId: req?.user?.userId
            })
        }).send(res)
    }

    cancelDiscountCode = async (req, res) => {
        new SuccessResponses({
            message: "Create new discount code successfully",
            metadata: await DiscountService.cancelDiscountCode({
                ...req.body,
                shopId: req?.user?.userId
            })
        }).send(res)
    }

}

module.exports = new DiscountController()