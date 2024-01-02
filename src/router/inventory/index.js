const express = require("express")
const router = express.Router()

const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const inventoryControllers = require("../../controllers/inventory.controllers")

router.use(authenticationV2);
router.post("/add-inventory", asyncHandler(inventoryControllers.addStock))

module.exports = router