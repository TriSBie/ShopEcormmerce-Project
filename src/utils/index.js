'use strict'
const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
    return _.pick(object, fields) //Creates an object composed of the picked object properties.
}

module.exports = { getInfoData }