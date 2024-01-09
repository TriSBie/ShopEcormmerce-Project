const RedisPubSubService = require("../services/redisPubsub.service");

class InventoryServiceTest {
    constructor() {
        RedisPubSubService.subscribe("purchase_events", (error, message) => {
            InventoryServiceTest.updateInventory(message)
            if (error) {
                console.log("Error: ", error);
            }
        });
    }

    static updateInventory(productId, quantity) {
        console.log("Update inventory: ", productId, quantity);
    }
}

module.exports = new InventoryServiceTest();