'use strict'

// ROOT ROUTER
const express = require("express")
const apiKey = require("../auth/checkAuth")
const { permission } = require("../services/apiKey.services")
const router = express.Router()

//api key
router.use(apiKey)

//check permission
router.use(permission('0000'))

router.use('/v1/api', require("./access/index"))

module.exports = router