'use strict'

const { findById } = require("../services/apiKey.services");


const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

//middleware
const apiKey = async (req, res, next) => {
    try {
        const key = req.headers[HEADER.API_KEY]?.toString();
        console.log(key)
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        //check objKey
        const objKey = await findById(key);
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }
        req.objKey = objKey // assigned to request object
        next()
    }
    catch (err) {
        console.log(err)
    }
}

module.exports = apiKey