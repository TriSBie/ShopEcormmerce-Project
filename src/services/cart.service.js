/**
 * Key features of Cart Services
 *  add products to cart [User]
 *  reduce product quantity by one [User]
 *  increase product quantity by one [User]
 *  get Cart [User]
 *  delete cart [User]
 *  delete cart item [User] 
 */

const { NotFoundError } = require("../core/error.response");
const cartModel = require("../models/cart.model");
const { getProductById } = require("../models/repository/product.repo");
const { convertStringToObjectId } = require("../utils");

class CartService {
    /**
     * 
     * @param {*} userId
     * @param {*} product : a specific product include (id, price, quantity)
     * @returns 
     */
    static async createNewCart({ userId, product }) {
        const query = {
            cart_userId: userId,
            cart_state: 'active'
        };
        const updateOrInsert = {
            $addToSet: {
                cart_products: product,
            },
        }
        const option = {
            upsert: true,
            new: true
        }

        return await cartModel.findOneAndUpdate(query, updateOrInsert, option);
    }

    static async addToCart({ userId, product = {} }) {
        // check cart being existed or not ?
        const userCart = await cartModel.findOne({
            cart_userId: userId,
            cart_state: 'active'
        })
        if (!userCart) {
            //  create new cart for user
            return await CartService.createNewCart({ userId, product })
        }

        // if cart exist with empty product
        if (!userCart.cart_products.length) {
            userCart.cart_products = [product];
            return await userCart.save();
        }

        return await CartService.updateUserCartProduct({ userId, product })
    }

    static async addToCartV2({ userId, shop_order_ids = {} }) {
        const { product_id, quantity, old_quantity } = shop_order_ids[0]?.item_products?.[0];
        const foundProduct = await getProductById(product_id);
        if (!foundProduct) {
            throw new NotFoundError("Product has not been found").getNotice();
        }

        const productShop = foundProduct.product_shop.toString();

        if (productShop !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError("There might something went wrong !").getNotice();
        }

        if (quantity === 0) {
            // deleted
            return await CartService.deleteUserCart({ userId, product_id })
        }

        //  update cart

        return await CartService.updateUserCartProduct({
            userId,
            product: {
                product_id,
                quantity: quantity + old_quantity,
            }
        })

    }

    static async updateUserCartProduct({ userId, product }) {
        const { product_id, quantity: product_quantity } = product;
        const query = {
            cart_userId: userId,
            "cart_products.product_id": product_id,
            cart_state: 'active'
        }

        const update = {
            $set: {
                "cart_products.$.quantity": product_quantity
            }
        }

        console.log({ update })

        const option = {
            new: true,
            upsert: true
        }

        const result = await cartModel.findOneAndUpdate(query, update, option)
        console.log({ result });
        return result
    }

    static async deleteUserCart({ userId, product_id }) {
        const query = {
            cart_userId: userId,
            cart_state: 'active'
        }
        // ** only remove the product in cart
        const update = {
            $pull: {
                cart_products: {
                    product_id
                }
            }
        }
        const deleteCart = await cartModel.updateOne(query, update);
        return deleteCart
        //  return await cartModel.findOneAndDelete(query); --> remove all cart
    }

    static async getListUserCart(userId) {
        const foundCart = await cartModel.findOne({
            cart_userId: userId,
            cart_state: 'active'
        }).lean();

        return foundCart;
    }
}

module.exports = CartService