const { product, clothing, electronic, furniture } = require("../product.model");
const { Types } = require("mongoose")


const findAllDraftForShop = async ({ query, limit, skip }) => {
    return queryProductBody({ query, limit, skip })
}

const findAllPublishedForShop = async ({ query, limit, skip }) => {
    return queryProductBody({ query, limit, skip })
}

const publishProductById = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });

    if (!foundShop) {
        return null;
    }

    /**
     * updateOne return object Query
     *  {
     *   acknowledged: true,
     *   modifiedCount: 1,
     *   upsertedId: null,
     *   upsertedCount: 0,
     *   matchedCount: 1
     *   }
     */
    const { modifiedCount } = await foundShop.updateOne({
        _id: new Types.ObjectId(product_id)
    }, {
        $set: {
            isDraft: false,
            isPublished: true
        }
    })

    return modifiedCount;
}

const unPublishProductById = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });

    if (!foundShop) {
        return null;
    }
    //  change isDraft properties
    foundShop.isDraft = false;
    foundShop.isPublished = true

    /**
     * updateOne return object Query
     *  {
     *   acknowledged: true,
     *   modifiedCount: 1,
     *   upsertedId: null,
     *   upsertedCount: 0,
     *   matchedCount: 1
     *   }
     */
    const { modifiedCount } = await foundShop.updateOne({
        _id: new Types.ObjectId(product_id)
    }, {
        $set: {
            isDraft: true,
            isPublished: false
        }
    })

    return modifiedCount;
}

const queryProductBody = async ({ query, skip, limit }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .sort({ updateAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean()
        .exec();
}

module.exports = {
    findAllDraftForShop,
    findAllPublishedForShop,
    unPublishProductById,
    publishProductById
}