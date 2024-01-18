'use strict'

const { SuccessResponses } = require("../core/success.response")
const { listNotification } = require("../services/notification.service")
class NotificationController {
    listNotiByUser = async (req, res, next) => {
        new SuccessResponses({
            message: "Get all notifications successfully",
            metadata: await listNotification()
        }).send(res)
    }
}

module.exports = new NotificationController()