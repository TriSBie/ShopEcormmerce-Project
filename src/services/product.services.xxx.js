'use strict'

const { Types } = require("mongoose")
const { BadRequestError } = require("../core/error.response")
const { product, clothing, electronic, furniture } = require("../models/product.model")
const { findAllDraftForShop, publishProductById, unPublishProductById, findAllPublishedForShop, searchProductByText, findAllProducts, findProduct, updateProductById } = require("../models/repository/product.repo")
const { updateNestedObjectParser, removeFalsyValues } = require("../utils")
const { insertInventory } = require("../models/repository/inventory.repo")

class ProductFactory {
    /**
     * This method will handle create product based on type passed in
     * @param {*} type : String 
     * 
     */
    static productRegistry = {}

    static registerProductType = (type, classRef) => {
        ProductFactory.productRegistry[type] = classRef
    }
    /**
     * 
     * @param {*} type : mapping types for getting instances  
     * @param {*} payload : data payload from request body or sth
     * @returns data has been created success
     */
    static async createProduct(type, payload) {
        const productClass = ProductFactory.productRegistry[type]; //   return a reference mapping with class instance

        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`).getNotice()

        //  passed in payload as constructor 
        return new productClass(payload).createProduct();
    }

    /**
     * 
     * @param {*} product_shop : the reference shop id of product
     * @returns data with draft status
     */
    static async findAllDraftForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true };
        return await findAllDraftForShop({ query, limit, skip })
    }

    /**
     * 
     * @param {*} product_shop : the reference shop id of product
     * @returns data with published status
     */
    static async findAllPublishedForShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true };
        return await findAllPublishedForShop({ query, limit, skip })
    }

    /**
     * 
     * @param {*} product_shop : the reference shop id of product
     * @param {*} product_id   : the id of product
     * @returns 
     */
    static async publishProductById(payload) {
        const { product_shop, product_id } = payload
        return await publishProductById({ product_shop, product_id })
    }

    /**
     * 
     * @param {*} product_shop : the reference shop id of product
     * @param {*} product_id   : the id of product
     * @returns 
     */
    static async unPublishProductById(payload) {
        const { product_shop, product_id } = payload
        return await unPublishProductById({ product_shop, product_id })
    }

    static async searchByText({ keySearch }) {
        return await searchProductByText(keySearch)
    }

    static async findAllProducts({ limit = 30, sort = "ctime", page = 1, filter = { isPublished: true } }) {
        return await findAllProducts({ limit, sort, page, filter, select: ["product_name", "product_price", "product_thumb", "product_shop"] })
    }

    static async findProduct({ product_id, unSelect = ['__v', 'product_variation'] }) {
        return await findProduct({ product_id, unSelect })
    }

    static async updateProductById({ type, payload, productId }) {
        const productClass = ProductFactory.productRegistry[type];
        //  update nested class 
        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`).getNotice()

        return new productClass(payload).updateProduct(productId, payload)
    }
}

class Product {
    constructor({
        product_name,
        product_thumb,
        product_description,
        product_price,
        product_quantity,
        product_type,
        product_shop,
        product_attributes,
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_description = product_description
        this.product_price = product_price
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    async createProduct(_id) {
        const newProduct = await product.create({ ...this, _id });
        if (newProduct) {
            // add product_stock in inventory collection
            await insertInventory({
                productId: newProduct._id,
                shopId: this.product_shop,
                stock: this.product_quantity
            })
        }
        return newProduct;
    }

    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product });
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newClothing) throw new BadRequestError("Create a new Clothe failed !").getNotice();

        const _id = newClothing._id;
        const newProduct = await super.createProduct(_id);

        if (!newProduct) throw new BadRequestError("Create a new Product failed !").getNotice();

        return newProduct;
    }

    async updateProduct(productId) {
        /***
         * 1. throw an error / handling falsy if field has falsy values. 
         * 2. check where should to be updated ?
         * */
        const objectParams = this;
        const updateNested = updateNestedObjectParser(objectParams);
        const removedFalsyValue = removeFalsyValues(updateNested)
        if (objectParams.product_attributes) {
            // update partial part of product
            await updateProductById({ productId, bodyUpdate: removedFalsyValue.product_attributes, model: clothing })
        }

        //  working with third-party should using async await
        const updateProduct = await super.updateProduct(productId, removedFalsyValue);
        return updateProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newElectronic) throw new BadRequestError("Create a new Electronic failed !").getNotice();

        const _id = newElectronic._id;
        const newProduct = await super.createProduct(_id);
        if (!newProduct) throw new BadRequestError("Create a new Product failed !").getNotice();

        return newProduct;
    }

    async updateProduct(productId) {
        /***
         * 1. throw an error / handling falsy if field has falsy values. 
         * 2. check where should to be updated ?
         * */
        const objectParams = this;
        const updateNested = updateNestedObjectParser(objectParams);
        const removedFalsyValue = removeFalsyValues(updateNested)
        if (objectParams.product_attributes) {
            // update partial part of product
            await updateProductById({ productId, bodyUpdate: removedFalsyValue.product_attributes, model: electronic })
        }

        //  working with third-party should using async await
        const updateProduct = await super.updateProduct(productId, removedFalsyValue);
        return updateProduct
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newFurniture) throw new BadRequestError("Create a new Furniture failed !").getNotice();

        const _id = newFurniture._id;
        const newProduct = await super.createProduct(_id);
        if (!newProduct) throw new BadRequestError("Create a new Product failed !").getNotice();

        return newProduct;
    }

    async updateProduct(productId) {
        /***
         * 1. throw an error / handling falsy if field has falsy values. 
         * 2. check where should to be updated ?
         * */
        const objectParams = this;
        const updateNested = updateNestedObjectParser(objectParams);
        const removedFalsyValue = removeFalsyValues(updateNested)
        if (objectParams.product_attributes) {
            // update partial part of product
            await updateProductById({ productId, bodyUpdate: removedFalsyValue.product_attributes, model: furniture })
        }

        //  working with third-party should using async await
        const updateProduct = await super.updateProduct(productId, removedFalsyValue);
        return updateProduct
    }
}

ProductFactory.registerProductType('Clothing', Clothing)
ProductFactory.registerProductType('Electronic', Electronic)
ProductFactory.registerProductType('Furniture', Furniture)

module.exports = ProductFactory