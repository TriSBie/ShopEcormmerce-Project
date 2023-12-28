'use strict'

const { SuccessResponses } = require("../core/success.response")
const CheckoutService = require("../services/checkout.service")

class CheckoutController {
    checkout = async (req, res) => {
        new SuccessResponses({
            message: 'Checkout successfully',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}

module.exports = new CheckoutController();