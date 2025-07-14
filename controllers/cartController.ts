import { Request, Response, NextFunction } from "express";
import { CartModel } from "../models/cartModel";
import { ApiError } from "../utils/apiError";


class CartController {
    private cartModel: CartModel;

    constructor(cartModel: CartModel) {
        this.cartModel = cartModel
    }

    async addProductToCart(req: Request, res: Response, next: NextFunction) {
        const { productId, productColor } = req.body;
        const userId = req.user.id;

        const cart = await this.cartModel.addProductToCart(productId, userId, productColor);

        if (!cart) {
            return next(new ApiError(404, 'Cart not found'));
        }

        res.status(200).json({
            status: 'success',
            message: 'Product added to cart successfully',
            numOfCartItems: cart.cartItems.length,
            data: cart,
        });
    }

    async getLoggedUserCart(req: Request, res: Response, next: NextFunction) {
        const userId = req.user.id;
        const cart = await this.cartModel.getUserCart(userId);
        if (!cart) {
            return next(new ApiError(404, 'Cart not found'));
        }
        res.status(200).json({
            status: 'success',
            message: 'Cart fetched successfully',
            numOfCartItems: cart.cartItems.length,
            data: cart,
        });
    }   

    async clearCart(req: Request, res: Response, next: NextFunction) {
        const userId = req.user.id;
        const cart = await this.cartModel.clearCart(userId);
        if (!cart) {
            return next(new ApiError(404, 'Cart not found'));
        }
        res.status(200).json({
            status: 'success',
            message: 'Cart cleared successfully',
            numOfCartItems: cart.cartItems.length,
            data: cart,
        });
    }

    async removeProductFromCart(req: Request, res: Response, next: NextFunction) {
        const  itemId  = req.params.itemId;
        const userId = req.user.id;
        const cart = await this.cartModel.removeProductFromCart(userId, itemId);
        if (!cart) {
            return next(new ApiError(404, 'Cart not found'));
        }
        res.status(200).json({
            status: 'success',
            message: 'Product removed from cart successfully',
            numOfCartItems: cart.cartItems.length,
            data: cart,
        });
    }

    async updateCartItemQuantity(req: Request, res: Response, next: NextFunction) {
        const itemId = req.params.itemId;
        const newQuantity = req.body.quantity;
        const userId = req.user.id;
        const cart = await this.cartModel.updateCartItemQuantity(userId, itemId, newQuantity);
        if (!cart) {
            return next(new ApiError(404, 'Cart not found'));
        }
        res.status(200).json({
            status: 'success',
            message: 'Product quantity updated successfully',
            numOfCartItems: cart.cartItems.length,
            data: cart,
        });
    }

    async applayCoupon(req: Request, res: Response, next: NextFunction) {
        const  couponName  = req.body.couponName;
        const userId = req.user.id;
        const cart = await this.cartModel.applayCoupon(couponName, userId);
        if (!cart) {
            return next(new ApiError(404, 'Cart not found or coupon invalid'));
        }
        res.status(200).json({
            status: 'success',
            message: 'Coupon applied successfully',
            numOfCartItems: cart.cartItems.length,
            data: cart,
        });
    }
}

export { CartController };