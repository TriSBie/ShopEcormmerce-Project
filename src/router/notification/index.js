'use strict'

const express = require("express")
const router = express.Router()
const { asyncHandler } = require("../../helpers/asyncHandler")
const { authenticationV2 } = require("../../auth/authUtils")
const notificationController = require("../../controllers/notification.controller")

router.use(authenticationV2)
router.get("/list-noti-by-user", asyncHandler(notificationController.listNotiByUser))
module.exports = router