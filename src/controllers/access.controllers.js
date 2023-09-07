'use strict'
const { CREATED, SuccessResponses } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
    login = async (req, res, next) => {
        new SuccessResponses({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    signUp = async (req, res, next) => {
        new CREATED({
            message: 'Registered OK!',
            metadata: await AccessService.signUp(req.body),
            option: {
                limit: 10
            }
        }).send(res)
    }
    logout = async (req, res, next) => {
        return
    }
}

module.exports = new AccessController()