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

const removeFalsyValues = (obj) => {
    Object.keys(obj).forEach((key) => {
        if (!obj[key]) {
            delete obj[key]
        }
    })
    return obj
}

/**
 * 
 * const a = {
 *  b {
 *   c : 2
 *  }
 * }
 * =>>> TO
 * 
 * const a = {
 *  b.c = 2
 * }
 * 
 * 
 * @param {*} obj 
 * @returns 
 */
const updateNestedObjectParser = (obj) => {
    const final = {}

    Object.keys(obj || {}).forEach((key) => {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            const response = updateNestedObjectParser(obj[key]);
            Object.keys(response || {}).forEach((a) => {
                final[`${key}.${a}`] = response[a]
            })
        } else {
            final[key] = obj[key]
        }
    })
    return final;
}

module.exports = { getInfoData, getSelectData, unSelectData, removeFalsyValues, updateNestedObjectParser }