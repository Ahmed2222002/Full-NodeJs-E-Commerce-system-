import mongoose from "mongoose";
import { ICart, ICartItem } from "../interfaces/cartInterface";
import { productsModel, couponModel } from "../config/AppContext";



class CartModel {
    private cartSchema: mongoose.Schema
    private cartModel: mongoose.Model<any>

    constructor() {
        this.cartSchema = new mongoose.Schema(
            {
                cartItems: [
                    {
                        product: {
                            type: mongoose.Schema.ObjectId,
                            ref: 'Product',
                        },
                        quantity: {
                            type: Number,
                            default: 1,
                        },
                        color: String,
                        price: Number,
                    },
                ],
                totalCartPrice: Number,
                totalPriceAfterDiscount: Number,
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'User',
                },
            },
            { timestamps: true }
        );

        this.cartModel = mongoose.model('Cart', this.cartSchema);
    }

    private calcTotalCartPrice(cart: ICart) {
        let totalPrice = 0;
        cart.cartItems.forEach((item: ICartItem) => {
            totalPrice += item.quantity * item.price;
        });
        cart.totalCartPrice = totalPrice;
        cart.totalPriceAfterDiscount = undefined;
        return totalPrice;
    }

    async addProductToCart(productId: string, userId: string, productColor: string) {

        const product = await productsModel.getProductById(productId);

        // 1) Get Cart for logged user
        let cart = await this.cartModel.findOne({ user: userId });

        if (!cart) {
            // create cart fot logged user with product
            cart = await this.cartModel.create({
                user: userId,
                cartItems: [{ product: productId, color: productColor, price: product.price }],
            });
        } else {
            // product exist in cart, update product quantity
            const productIndex = cart.cartItems.findIndex(
                (item: ICartItem) => item.product.toString() === productId && item.color === productColor
            );

            if (productIndex > -1) {
                const cartItem = cart.cartItems[productIndex];
                cartItem.quantity += 1;

                cart.cartItems[productIndex] = cartItem;
            } else {
                // product not exist in cart,  push product to cartItems array
                cart.cartItems.push({ product: productId, color: productColor, price: product.price });
            }
        }

        // Calculate total cart price
        this.calcTotalCartPrice(cart);
        await cart.save();

        return cart;
    }

    async getCartById(cartId: string) {
        const cart = await this.cartModel.findById(cartId);
        return cart;
    }

    async getUserCart(userId: string) {
        const cart = await this.cartModel.findOne({ user: userId });
        return cart;
    }

    async removeProductFromCart(userId: string, itemId: string) {
        const cart = await this.cartModel.findOneAndUpdate(
            { user: userId },
            {
                $pull: { cartItems: { _id: itemId } },
            },
            { new: true }
        );

        this.calcTotalCartPrice(cart);
        cart.save();

        return cart;
    }

    async clearCart(userId: string) {
        const cart = await this.cartModel.findOneAndDelete({ user: userId });
        return cart;
    }

    async updateCartItemQuantity(userId: string, itemId: string, newQuantity: number) {

        const cart = await this.cartModel.findOne({ user: userId });

        const itemIndex = cart.cartItems.findIndex(
            (item: ICartItem) =>item._id.toString() === itemId);
       
        if (itemIndex > -1) {
            const cartItem = cart.cartItems[itemIndex];
            cartItem.quantity = newQuantity;
            cart.cartItems[itemIndex] = cartItem;
        } else {
            return null;
        }

        this.calcTotalCartPrice(cart);

        await cart.save();

        return cart;
    }

    async applayCoupon(couponName: string, userId: string) {
        // 1) Get coupon based on coupon name
        const coupon = await couponModel.getCouponByName(couponName);

        if (!coupon) {
            //console.log('Coupon not found');
            return null;
        }

        // 2) Get logged user cart to get total cart price
        const cart = await this.cartModel.findOne({ user: userId });

        const totalPrice = cart.totalCartPrice;


        // 3) Calculate price after priceAfterDiscount
        const totalPriceAfterDiscount = (
            totalPrice -
            (totalPrice * coupon.discount) / 100
        ).toFixed(2); // 99.23


        cart.totalPriceAfterDiscount = totalPriceAfterDiscount;
        await cart.save();

        return cart;
    }


}

export { CartModel };

