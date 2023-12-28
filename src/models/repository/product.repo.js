const { NotFoundError } = require("../../core/error.response");
const { getSelectData, getUnSelectData, convertStringToObjectId } = require("../../utils");
const { product, clothing, electronic, furniture } = require("../product.model");
const { Types } = require("mongoose")


const getProductById = async (product_id) => {
    return await product.findOne({
        _id: convertStringToObjectId(product_id)
    })
}

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
        throw new NotFoundError("Product are not found! Try again !");
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
    const { modifiedCount } = await product.updateOne({
        _id: new Types.ObjectId(product_id)
    }, {
        $set: {
            isDraft: false,
            isPublished: true
        },
    })

    return modifiedCount;
}

const unPublishProductById = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id)
    });

    if (!foundShop) {
        throw new NotFoundError("Product are not found! Try again !");
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
            isDraft: true,
            isPublished: false
        }
    })

    return modifiedCount;
}

const searchProductByText = async (keySearch) => {
    const regexSearch = new RegExp(keySearch);
    const foundProduct = await product
        .find(
            {
                $text: { $search: regexSearch }
            },
            {
                score: { $meta: 'textScore' }
            }
        ).sort({ score: { $meta: 'textScore' } }).lean();

    return foundProduct;
}

const findAllProducts = async ({ limit, sort, page, filter, select }) => {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 }
    const selectQuery = getSelectData(select);

    const products = await product
        .find(filter)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .select(selectQuery)
        .lean();

    return products;
}

const findProduct = async ({ product_id, unSelect }) => {
    const unSelectQuery = getUnSelectData(unSelect);

    const productFound = await product
        .findOne({
            _id: product_id
        })
        .select(unSelectQuery)
        .lean();

    return productFound;
}

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, {
        new: isNew
    })
}

//  check whether product is valid or not
const checkoutProductByServer = async (products) => {
    return await Promise.all(products.map(async product => {
        const foundProduct = await getProductById(product.productId);
        if (foundProduct) {
            return {
                productId: products.productId,
                quantity: foundProduct.quantity,
                price: foundProduct.product_price
            }
        }
    }))
}


const queryProductBody = async ({ query, skip, limit }) => {
    return await product.find(query)
        // saving ref, take the object id and in place of by the specify fields
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
    publishProductById,
    searchProductByText,
    findAllProducts,
    findProduct,
    updateProductById,
    getProductById,
    checkoutProductByServer
}