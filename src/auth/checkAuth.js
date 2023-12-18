'use strict'

const { findById } = require("../services/apiKey.services");

const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}

//middleware applied for check apiAuth
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString(); // get api key from header
        console.log({ key });
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        const objKey = await findById(key); //check objKey
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        /**objKey contain [key, permission, status */
        req.objKey = objKey
        next()
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = apiKey