'use strict'
const _ = require("lodash");

const getInfoData = ({ object = {}, fields = [] }) => {
    return _.pick(object, fields) //Creates an object composed of the picked object properties.
}

/**
 * 
 * @param {*} select 
 * @example from ['a','b']
 * @returns {a : 1, b : 1}
 */
const getSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 1]))
}

const unSelectData = (select = []) => {
    return Object.fromEntries(select.map((el) => [el, 0]))
}

module.exports = { getInfoData, getSelectData, unSelectData }