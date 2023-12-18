const { ONE, TWO } = require("../const/app.const");
const shopModel = require("../models/shop.model");

const findByEmail = async ({ email, select = {
    email: ONE, password: ONE, name: ONE, status: ONE, roles: ONE,
} }) => {
    return shopModel.findOne({ email }).select(select).lean();
}

module.exports = { findByEmail }