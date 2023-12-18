'use strict'

// ROOT ROUTER
const express = require("express")
const apiKey = require("../auth/checkAuth")
const { permission } = require("../auth/authUtils")
const router = express.Router()

//api key
router.use(apiKey)
//check permission
router.use(permission('0000'))

router.use('/v1/api', require("./access/index"))
router.use('/v1/api/product', require("./product/index"))

module.exports = router