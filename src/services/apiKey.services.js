'use strict'

const apiKeyModel = require("../models/apiKey.model")
const crypto = require("crypto")

const findById = async (key) => {
    /* CREATED ONCE - USE EVERY WHERE - ONLY ADMIN HAS PERMISSION */

    /* const apiKey = await apiKeyModel.create({
        //create new key after access the old one
        key: crypto.randomBytes(64).toString('hex'),
        permissions: ["0000"] // use as enum declaration
    }) */

    const objKey = await apiKeyModel.findOne({
        key, status: true
    }).lean();
    //lean : just play a Javascript plain object
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