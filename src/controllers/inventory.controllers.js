'use strict'

const { SuccessResponses } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
    addStock = async (req, res) => {
        new SuccessResponses({
            message: "Add new stock to inventory successfully",
            metadata: await InventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

module.exports = new InventoryController();