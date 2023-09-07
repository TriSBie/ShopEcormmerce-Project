'use strict'

const apiKeyModel = require("../models/apiKey.model")
const crypto = require("crypto")

const findById = async (key) => {
    const apiKey = await apiKeyModel.create({
        key: crypto.randomBytes(64).toString('hex'),
        permissions: ["0000"]
    })
    console.log(apiKey)
    const objKey = await apiKeyModel.findOne({
        key, status: true
    }).lean();
    return objKey;
}


//using closure function that references variables from outside its body
const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: "Permission Denied"
            })
        }
        console.log("Permission: ", req.objKey.permissions);
        const validPermission = req.objKey.permissions.includes(permission);
        if (!validPermission) {
            return res.status(403).json({
                message: "Permission Denied"
            })
        }
        return next();
    }
}


module.exports = { findById, permission }