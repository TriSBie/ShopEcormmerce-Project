'use strict'

const { BadRequestError } = require("../core/error.response")
const { product, clothing, electronic } = require("../models/product.model")

class ProductFactory {
    /**
     * This method will handle create product based on type passed in
     * @param {*} type : String 
     * 
     */
    static async createProduct(type, payload) {
        switch (type) {
            case "Clothing":
                return new Clothing(payload).createProduct();
            case "Electronic":
                return new Electronic(payload).createProduct()
            default:
                throw new BadRequestError(`No given type available ${type}`)
        }
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

    async createProduct() {
        return await product.create(this);
    }
}

class Clothing extends Product {
    async createProduct() {
        const newClothing = await clothing.create(this.product_attributes);
        if (!newClothing) throw new BadRequestError("Create a new Clothe failed !");

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError("Create a new Product failed !");

        return newProduct
    }
}

class Electronic extends Product {
    async createProduct() {
        const newElectronic = await electronic.create(this.product_attributes);
        if (!newElectronic) throw new BadRequestError("Create a new Electronic failed !");

        const newProduct = await super.createProduct();
        if (!newProduct) throw new BadRequestError("Create a new Product failed !");

        return newProduct
    }
}

module.exports = ProductFactory