'use strict'

const { convertStringToObjectId, getUnSelectData, getSelectData } = require("../../utils")

const findDiscountByCodeAndShop = async ({ code, shopId }) => {
    await discountModel.findOne({
        discount_code: code,
        discount_shopId: convertStringToObjectId(shopId)
    })
}

const findAllDiscountCodeUnselect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    model,
    filter,
    unSelect
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const selectQuery = getUnSelectData([unSelect]);

    const documents =
        await model
            .find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(selectQuery)
            .lean();

    return documents;
}

const findAllDiscountCodeSelect = async ({
    limit = 50,
    page = 1,
    sort = 'ctime',
    model,
    filter,
    unSelect
}) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 };
    const selectQuery = getSelectData([unSelect]);

    const documents =
        await model
            .find(filter)
            .sort(sortBy)
            .skip(skip)
            .limit(limit)
            .select(selectQuery)
            .lean();

    return documents;
}


module.exports = { findDiscountByCodeAndShop, findAllDiscountCodeUnselect, findAllDiscountCodeSelect }