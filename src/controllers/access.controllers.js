'use strict'
const AccessService = require("../services/access.service");

class AccessController {
    signUp = async (req, res, next) => {
        console.log(req.body)
        try {
            console.log(`[P]::signUp::`, req.body);
            return res.status(200).json(
                await AccessService.signUp(req.body)
            )
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = new AccessController()