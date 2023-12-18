'use strict'

const apiKeyModel = require("../models/apiKey.model")

const findById = async (key) => {
    /* CREATED ONCE - USE EVERY WHERE - ONLY ADMIN HAS PERMISSION */

    // const apiKey = await apiKeyModel.create({
    //     //create new key after access the old one
    //     key: crypto.randomBytes(64).toString('hex'),
    //     permissions: ["0000"] // use as enum declaration
    // })
    // console.log({ apiKey });

    const objKey = await apiKeyModel.findOne({
        key, status: true
    }).lean();
    //  lean : just plays as a Javascript plain object
    return objKey;
}

module.exports = { findById }