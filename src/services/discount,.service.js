'use strict'

const discountModel = require("../models/discount.model");
const { BadRequestError, NotFoundError } = require("../core/error.response");
const { convertStringToObjectId } = require("../utils");
const { findAllDiscountCodeUnselect, checkDiscountExist } = require("../models/repository/discount.repo");
const { findAllProducts } = require("../models/repository/product.repo");

/**
 * Step by step for generate new discount
 * [1] - Generate Discount Code by [Shop/Admin]
 * [2] - Get discount amount [User]
 * [3] - Get all discount codes [User/Shop]
 * [4] - Verify discount codes []
 * [5] - Delete discount code [Admin/Shop]
 * [6] - Cancel discount code [User]
 *
 * <<<< All services should be declared by static 
 */

class DiscountService {
	static async createDiscountCode(payload) {
		const {
			code,
			start_date,
			end_date,
			is_active,
			shopId,
			min_order_value,
			product_ids,
			applies_to,
			name,
			description,
			type,
			value,
			max_uses_amount,
			max_use_per_user,
			uses_count,
			users_used
		} = payload;

		/**
		 * The rules of checking date 
		 * [1] - not exceed endDate or smaller than startDate
		 * [2] - the start_date & end_date inputted should be valid 
		 * [3] - check require fields
		*/
		if (!start_date && !end_date) {
			throw new BadRequestError("Discount operation date must be given").getNotice();
		}

		if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
			throw new BadRequestError("Discount code has expired").getNotice();
		}

		if (new Date(start_date) >= new Date(end_date)) {
			throw new BadRequestError("Discount's start_date must smaller than end_date").getNotice();
		}

		//  create index for discount code

		const foundDiscount = await checkDiscountExist({
			model: discountModel,
			filter: {
				discount_code: code,
				discount_shopId: convertStringToObjectId(shopId)
			}
		})

		if (foundDiscount && foundDiscount.discount_is_active) {
			throw new BadRequestError("Discount code are duplicated").getNotice();
		}

		const newDiscount = await discountModel.create({
			discount_name: name,
			discount_description: description,
			discount_type: type,
			discount_value: value,
			discount_code: code,
			discount_start_date: new Date(start_date),
			discount_end_date: new Date(end_date),
			discount_maximum_uses_amount: max_uses_amount,
			discount_uses_count: uses_count,
			discount_user_used_info: users_used,
			discount_maximum_use_per_user: max_use_per_user,
			discount_minimum_order_value: min_order_value || 0,
			discount_shopId: shopId,
			discount_is_active: is_active,
			discount_applies_to: applies_to,
			discount_product_ids: applies_to === "all" ? [] : product_ids
		})

		return newDiscount;
	}

	static async updateDiscountCode() {
		return
	}

	static async getProductsByDiscountCode(payload) {
		const { code, shopId, userId, limit, page } = payload

		const foundDiscount = await checkDiscountExist({
			model: discountModel,
			filter: {
				discount_code: code,
				discount_shopId: convertStringToObjectId(shopId)
			}
		})

		if (!foundDiscount) {
			throw new BadRequestError("Discount code does not exist !")
		}

		const { discount_applies_to, discount_product_ids } = foundDiscount;
		let products;

		if (discount_applies_to === 'all') {
			//  get all products belong to specific shop by discount
			products = await findAllProducts(
				{
					filter: {
						product_shop: convertStringToObjectId(shopId),
						isPublished: true
					},
					limit: +limit,
					page: +page,
					select: ['product_name']
				});
		} else if (discount_applies_to === 'specific') {
			//	get specific products belong to specification discount  
			products = await findAllProducts(
				{
					filter: {
						_id: {
							$in: {
								discount_product_ids,
							},
						},
						isPublished: true
					},
					limit: +limit,
					page: +page,
					select: ['product_name']
				}
			);
		}
		return products
	}

	static getAllDiscountCodeByShop = async (payload) => {
		const { limit, page, shopId } = payload;
		const discounts = await findAllDiscountCodeUnselect({
			limit: +limit,
			page: +page,
			model: discountModel,
			filter: {
				discount_shopId: convertStringToObjectId(shopId),
				discount_is_active: true
			},
			unSelect: ["__v", "discount_shopId"]
		})

		if (!discounts) {
			throw new NotFoundError(`Not any given discounts available with shop : ${shopId}`).getNotice();
		}

		return discounts;
	}

	/**
	 * Apply discount code
	 * order_product = [
	 * 	{
	 * 	productId,
	 * 	shopId,
	 * 	quantity,
	 * 	name,
	 * 	price	
	 * 	},
	 * {
	 * 	productId,
	 * 	shopId,
	 * 	quantity,
	 * 	name,
	 * 	price	
	 * 	}
	 * ]
	 * 
	 */
	static getDiscountAmount = async (payload) => {
		const { code, shopId, userId, products } = payload
		const foundDiscount = await checkDiscountExist({
			model: discountModel,
			filter: {
				discount_code: code,
				discount_shopId: convertStringToObjectId(shopId)
			}
		});

		if (!foundDiscount) {
			throw new NotFoundError("Discount code does not exist !").getNotice()
		}

		const {
			discount_is_active,
			discount_end_date,
			discount_start_date,
			discount_minimum_order_value,
			discount_maximum_uses_amount,
			discount_value,
			discount_user_used_info,
			discount_type
		} = foundDiscount;

		if (!discount_is_active) {
			throw new NotFoundError("Discount code has expired !").getNotice();
		}

		//	if number of usage discount are zero ~ not any available
		if (!discount_maximum_uses_amount) {
			throw new NotFoundError("Discount code has fully been used !").getNotice();
		}

		//	check discount date_time is valid ? over the pass or in future ?
		if (new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)) {
			throw new NotFoundError("Discount date_time is not valid !").getNotice();
		}

		let totalOrder = 0;

		// 	check min value of discount 
		if (discount_minimum_order_value) {
			totalOrder = products.reduce((accumulator, product) => {
				return accumulator + (product.quantity * product.price);
			}, 0);

			if (totalOrder < discount_minimum_order_value) {
				throw new NotFoundError(`Discount requires a minimum order value of ${discount_minimum_order_value}`).getNotice()
			}
		}

		//	check max_user_use_amount still have a slot
		if (discount_maximum_uses_amount > 0) {
			const userUseDiscount = discount_user_used_info.find((user) => user.userId === userId);
			if (userUseDiscount) {
				//	user has an account and use discount code => 
				//	(discount_maximum_uses_amount + 1 & discount_user_used_info) 
				throw new NotFoundError("User has been applied this discount code")
			} else {
				//	add user into discount_user_used_info 
			}
		}

		//	check type of discount
		const amount = discount_type === "fixed_amount" ? discount_value : (totalOrder * discount_value) / 100
		return { totalOrder, discount: amount, totalPrice: totalOrder - amount }
	}

	static deleteDiscountCode = async (payload) => {
		const { shopId, code } = payload
		//	found discount are exist or not ?
		const foundDiscount = await checkDiscountExist({
			model: discountModel, filter: {
				discount_shopId: convertStringToObjectId(shopId),
				discount_code: code
			}
		});

		if (!foundDiscount) {
			throw new NotFoundError("Discount doesn't exist yet !");
		}

		const deleted = await discountModel.findOneAndDelete({
			discount_shopId: convertStringToObjectId(shopId),
			discount_code: code
		})

		if (!deleted) {
			throw new BadRequestError(`Deleted discount with code ${code} fail !`)
		}

		return deleted;
	}

	static cancelDiscountCode = async (payload) => {
		const { code, shopId, userId } = payload;

		const foundDiscount = await checkDiscountExist({
			model: discountModel,
			filter: {
				discount_code: code,
				discount_shopId: convertStringToObjectId(shopId)
			}
		})

		if (!foundDiscount) {
			throw new NotFoundError("Discount doesn't exist yet !");
		}

		const result = await discountModel.findByIdAndUpdate(foundDiscount._id, {
			$pull: {
				discount_user_used_info: userId
			},
			$inc: {
				discount_maximum_use_per_user: 1,
				discount_uses_count: -1
			}
		})
		return result;
	}
}

module.exports = DiscountService