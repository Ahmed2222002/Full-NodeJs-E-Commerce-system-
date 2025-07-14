import { Request, Response , NextFunction} from "express";
import { CouponModel } from "../models/couponModel";
import { ICoupon } from "../interfaces/couponInterface";
import { ApiError } from "../utils/apiError";

class CouponController {
    private couponModel: CouponModel;

    constructor(couponModel: CouponModel) {
        this.couponModel = couponModel
    }


    // @desc Create new coupon
    // @route POST api/v1/coupons
    // @access Private admin
    async createCoupon(req: Request, res: Response) {
        const coupon: ICoupon = req.body;
        const response = await this.couponModel.createCoupon(coupon);
        res.status(201).json({ data: response });
    }

    async getCoupons(req: Request, res: Response) {
        const coupons = await this.couponModel.getCoupons();
        res.status(201).json({ data: coupons });
    }

    async getCouponById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const coupon = await this.couponModel.getCouponById(id);
        if(!coupon){
            return next(new ApiError(404, `Coupon not found`));
        } 
        res.status(201).json({ data: coupon });
    }

    async updateCoupon(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const coupon: ICoupon = req.body;
        const response = await this.couponModel.updateCoupon(id, coupon);
        if(!response){
            return next(new ApiError(404, `Coupon not found`));
        } 
        res.status(201).json({ data: response });
    }

    async deleteCoupon(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const response = await this.couponModel.deleteCoupon(id);
        if(!response){
            return next(new ApiError(404, `Coupon not found`));
        } 
        res.status(201).json({ data: response });
    }
}

export { CouponController };