'use strict'

const notificationModel = require("../models/notification.model");

const pushNotifiSystem = async ({
    type = 'SHOP-001',
    receiverId,
    senderId,
    options = {}
}) => {
    let noti_content = ''
    switch (type) {
        case "SHOP-001":
            noti_content = '@@@ has posted a new product'
            break;
        case "ORDER-001":
            noti_content = '@@@ has ordered successfully'
            break;
        case "PROMOTION-001":
            noti_content = '@@@ has posted a new voucher'
            break;
    }

    const newNotification = await notificationModel.create({
        noti_type: type,
        noti_senderId: senderId,
        noti_receiverId: receiverId,
        noti_content,
        noti_options: options
    })
    return newNotification
}

const listNotiByUser = async ({
    userId = 1,
    type = 'ALL',
    isRead = 0
}) => {

    const match = {
        noti_receiverId: userId
    }

    if (type !== 'ALL') {
        match['noti_type'] = type
    }

    return await notificationModel.aggregate([
        {
            $match: match
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_receiverId: 1,
                noti_content: 1,
                createdAt: 1,
            }
        }
    ])
}
module.exports = {
    pushNotifiSystem,
    listNotiByUser
}