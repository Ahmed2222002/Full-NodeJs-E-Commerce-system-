import mongoose from "mongoose";
import { ICart } from "../interfaces/cartInterface";
import { IOrder } from "../interfaces/orderInterface";
import { productsModel, cartModel } from "../config/AppContext";
class OrdersModel {
    private orderSchema: mongoose.Schema;
    private orderModel: mongoose.Model<any>;

    constructor() {
        this.orderSchema = new mongoose.Schema(
            {
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'User',
                    required: [true, 'Order must be belong to user'],
                },
                cartItems: [
                    {
                        product: {
                            type: mongoose.Schema.ObjectId,
                            ref: 'Product',
                        },
                        quantity: Number,
                        color: String,
                        price: Number,
                    },
                ],

                taxPrice: {
                    type: Number,
                    default: 0,
                },
                shippingAddress: {
                    details: String,
                    phone: String,
                    city: String,
                    postalCode: String,
                },
                shippingPrice: {
                    type: Number,
                    default: 0,
                },
                totalOrderPrice: {
                    type: Number,
                },
                paymentMethodType: {
                    type: String,
                    enum: ['card', 'cash'],
                    default: 'cash',
                },
                isPaid: {
                    type: Boolean,
                    default: false,
                },
                paidAt: Date,
                isDelivered: {
                    type: Boolean,
                    default: false,
                },
                deliveredAt: Date,
            },
            { timestamps: true }
        );

        this.orderModel = mongoose.model('Order', this.orderSchema);
    }

    async createCashOrder(order: IOrder, cart: ICart) {

        // app settings
        const taxPrice = 0;
        const shippingPrice = 0;

        // 1) Get order price depend on cart price "Check if coupon apply"
        const cartPrice = cart.totalPriceAfterDiscount
            ? cart.totalPriceAfterDiscount
            : cart.totalCartPrice;

        const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

        // 2) Create order with default paymentMethodType cash
        const createdOrder = await this.orderModel.create({
            user: order.user,
            cartItems: cart.cartItems,
            shippingAddress: order.shippingAddress,
            totalOrderPrice,
        });

        // 3) After creating order, decrement product quantity, increment product sold
        if (createdOrder) {
            const bulkOption = cart.cartItems.map((item) => ({
                updateOne: {
                    filter: { _id: item.product },
                    update: { $inc: { quntity: -item.quantity, sold: +item.quantity } },
                },
            }));
            await productsModel.getProductModel().bulkWrite(bulkOption, {});

            // 5) Clear user cart
            await cartModel.clearCart(order.user);
        }

        return createdOrder;
    }

    async getLoggedUserOrders(userId: string) {
        const orders = await this.orderModel.find({ user: userId });
        return orders;
    }

    getAllOrders() {
        const orders = this.orderModel.find({});
        return orders;
    }

    updateOrderToDelivered(orderId: string) {
        const updatedOrder = this.orderModel.findByIdAndUpdate(orderId, { isDelivered: true, deliveredAt: Date.now() }, { new: true });
        return updatedOrder;
    }

    updateOrderToPaid(orderId: string) {
        const updatedOrder = this.orderModel.findByIdAndUpdate(orderId, { isPaid: true, paidAt: Date.now() }, { new: true });
        return updatedOrder;
    }


}

export { OrdersModel };