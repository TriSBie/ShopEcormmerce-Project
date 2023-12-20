'use strict'

const { BadRequestError } = require("../core/error.response")
const { product, clothing, electronic, furniture } = require("../models/product.model")
const { findAllDraftForShop, publishProductById, unPublishProductById, findAllPublishedForShop, searchProductByText } = require("../models/repository/product.repo")

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

        if (!productClass) throw new BadRequestError(`Invalid Product Types ${type}`)

        //  pass payload as constructor 
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
    static async publishProductById({ product_shop, product_id }) {
        return await publishProductById({ product_shop, product_id })
    }

    /**
     * 
     * @param {*} product_shop : the reference shop id of product
     * @param {*} product_id   : the id of product
     * @returns 
     */
    static async unPublishProductById({ product_shop, product_id }) {
        return await unPublishProductById({ product_shop, product_id })
    }

    static async searchByText({ keySearch }) {
        return await searchProductByText(keySearch)
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
        return await product.create({ ...this, _id });
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newClothing) throw new BadRequestError("Create a new Clothe failed !");

        const _id = newClothing._id;
        const newProduct = await super.createProduct(_id);
        if (!newProduct) throw new BadRequestError("Create a new Product failed !");

        return newProduct;
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newElectronic) throw new BadRequestError("Create a new Electronic failed !");

        const _id = newElectronic._id;
        const newProduct = await super.createProduct(_id);
        if (!newProduct) throw new BadRequestError("Create a new Product failed !");

        return newProduct;
    }
}

class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({ ...this.product_attributes, product_shop: this.product_shop });
        if (!newFurniture) throw new BadRequestError("Create a new Furniture failed !");

        const _id = newFurniture._id;
        const newProduct = await super.createProduct(_id);
        if (!newProduct) throw new BadRequestError("Create a new Product failed !");

        return newProduct;
    }
}

ProductFactory.registerProductType('clotheSchema', Clothing)
ProductFactory.registerProductType('electronicSchema', Electronic)
ProductFactory.registerProductType('furnitureSchema', Furniture)

module.exports = ProductFactory