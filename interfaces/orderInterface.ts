import { ICartItem } from "./cartInterface";

interface IOrder{
    user: string,
    cartItems: ICartItem[],
    taxPrice: number,
    shippingPrice: number,
    shippingAddress: string,
    totalOrderPrice: number,
    paymentMethodType: string,
    isPaid: boolean,
    paidAt: Date,
    isDelivered: boolean,
    deliveredAt: Date
}

export {IOrder};