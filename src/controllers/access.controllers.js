'use strict'
const { CREATED, SuccessResponses } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {

    handlerRefreshToken = async (req, res, next) => {
        new SuccessResponses({
            message: 'Get token success',
            metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        }).send(res)
    }


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
        new SuccessResponses({
            message: 'Logout successFully!',
            metadata: await AccessService.logout({ keyStore: req.keyStore })
        }).send(res)
    }
}

module.exports = new AccessController()