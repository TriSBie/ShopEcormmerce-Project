'use strict'

const { NotFoundError } = require("../core/error.response");
const findCartById = require("../models/repository/cart.repo");
const { checkoutProductByServer } = require("../models/repository/product.repo");

class CheckoutService {
	/**
	 * {
	 *		"userId"
				"cartId",
				"shop_carts_item" : [
					{
						"shopId",
						"shop_discount" : [
							{
								"shopId",
								"discount_id",
								"code"
							}
						],
						"item_products" : [
							{
								"product_id",
								"name",
								"shopId",
								"quantity",
								"price"
							}
						]
					}
				]
			}
	 */

	static async checkoutReview({ cartId, shop_carts_item, userId, }) {
		const foundCart = await findCartById(cartId);

		if (!foundCart) {
			throw new NotFoundError("Cart has not been found !");
		}

		const checkoutOrder = {
			totalPrice: 0, // total amount of price
			feeShip: 0, // extra transportation fee
			totalDiscount: 0, // total amount of discount 
			totalCheckout: 0 // ???
		}

		const shop_carts_item_new = []

		for (let index = 0; index < shop_carts_item.length; index++) {

			const { shopId, shop_discounts, item_products } = shop_carts_item[0];
			const checkoutProductServer = await checkoutProductByServer(item_products);

			if (!checkoutProductServer[0]) {
				throw NotFoundError("There might something wrong in your cart: ", [index])
			}

			//	summary total checkout in cart
			const totalCheckoutPrice = checkoutProductServer.reduce((acc, curVal) => {
				return acc + (curVal.quantity * curVal.price);
			}, 0)


			//	each product should have checkout price idependently
			const itemCheckout = {
				shopId,
				shop_discounts,
				totalPriceRaw: totalCheckoutPrice,
				totalPriceApplyDiscount: totalCheckoutPrice,
				item_products: checkoutProductServer
			}

			if (shop_discounts[i].length > 0) {
				/**
				 * totalOrder : original total
				 * totalPrice : total price applied discount
				 */
				const { totalOrder = 0, totalPrice = 0, discount = 0 } = await getDiscountAmount({
					code: shop_discounts[i].code,
					shopId: shopId,
					userId: userId,
					products: checkoutProductServer
				})

				if (discount > 0) {
					checkoutOrder.totalDiscount += discount;
					itemCheckout.totalPriceApplyDiscount = totalCheckoutPrice - discount
				}
			}

			checkoutOrder.totalCheckout += itemCheckout.totalPriceApplyDiscount;
			checkoutOrder.totalPrice += itemCheckout.totalPriceRaw;

			shop_carts_item_new.push(itemCheckout);
		}
		return {
			shop_carts_item,
			shop_carts_item_new,
			checkoutOrder
		}
	}
}

module.exports = CheckoutService