import { Request, Response, NextFunction } from "express";
import { OrdersModel } from "../models/orderModel";
import { IOrder } from "../interfaces/orderInterface";
import { ApiError } from "../utils/apiError";
import { cartModel } from "../config/AppContext";
import { ICart } from "../interfaces/cartInterface";

class OrdersController {
    private orderModel: OrdersModel;

    constructor(orderModel: OrdersModel) {
        this.orderModel = orderModel;
    }

    async createCashOrder(req: Request, res: Response, next: NextFunction) {
        // 1) Get user cart 
        const cart: ICart = await cartModel.getCartById(req.params.cartId);
        if (!cart) {
            return next(
                new ApiError(404, `There is no such cart with id ${req.params.cartId}`)
            );
        }

        const order: Partial<IOrder> = {
            user: req.user._id,
            shippingAddress: req.body.shippingAddress,
        }

        // 2) Create order with default paymentMethodType cash
        const createdOrder = await this.orderModel.createCashOrder(order as IOrder, cart);

        if (!createdOrder) {
            return next(new ApiError(400, 'Failed to create order'));
        }

        res.status(200).json({
            status: 'success',
            message: 'Order created successfully',
            data: createdOrder,
        });

    }

    async getLoggedUserOrders(req: Request, res: Response, next: NextFunction) {
        if (req.user.role === 'user') {
            const orders = await this.orderModel.getLoggedUserOrders(req.user._id);
            res.status(200).json({ data: orders });
        } else {
            next();
        }
    }

    async getAllOrders(req: Request, res: Response, next: NextFunction) {

        if (req.user.role === 'admin') {
            const orders = await this.orderModel.getAllOrders();
            res.status(200).json({ data: orders });
        } else {
            next();
        }
    }

    async updateOrderToDelivered(req: Request, res: Response, next: NextFunction) {
        const order = await this.orderModel.updateOrderToDelivered(req.params.orderId);
        res.status(200).json({ status: 'success', data: order });
    }

    async updateOrderToPaid(req: Request, res: Response, next: NextFunction) {
        const order = await this.orderModel.updateOrderToPaid(req.params.orderId);
        res.status(200).json({ status: 'success', data: order });
    }
}

export { OrdersController };