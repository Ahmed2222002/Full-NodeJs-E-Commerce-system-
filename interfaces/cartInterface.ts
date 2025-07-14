interface ICartItem{
    _id: string;
    product: string;
    quantity: number;
    color: string;
    price: number;
}

interface ICart{
    cartItems: ICartItem[];
    totalCartPrice: number;
    totalPriceAfterDiscount: number | undefined;
    user: string;
}

export {ICart, ICartItem};