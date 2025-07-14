import mongoose from "mongoose";
import { ICoupon } from "../interfaces/couponInterface";

class CouponModel {
    private couponSchema: mongoose.Schema;
    private couponModel: mongoose.Model<any>;

    constructor(){
        this.couponSchema = new mongoose.Schema(
            {
                name: {
                    type: String,
                    required: [true, 'Coupon name is required'],
                    unique: [true, 'Coupon must be Unique'],
                    minLength: [3, 'Too short coupon name'],
                    maxLength: [32, 'Too long coupon name']
                },
               
                discount: {
                    type: Number,
                    required: [true, 'Coupon discount is required'],
                    min: [1, 'Min discount value is 1.0'],
                    max: [100, 'Max discount value is 100.0'],
                },
                expDate: {
                    type: Date,
                    required: [true, 'Coupon expiration date is required'],
                },
            },
            { timestamps: true }
        );
        
        this.couponModel = mongoose.model('Coupon', this.couponSchema);
    }

    createCoupon(coupon: ICoupon) {
        return this.couponModel.create(coupon);
    }

    getCoupons() {
        return this.couponModel.find();
    }

    getCouponById(couponId: string) {
        return this.couponModel.findById(couponId);
    }

    getCouponByName(couponName: string) {
        return this.couponModel.findOne({
            name: couponName,
            expire: { $gt: Date.now() },
        });
    }

    updateCoupon(couponId: string, coupon: ICoupon) {
        return this.couponModel.findByIdAndUpdate(couponId, coupon, { new: true });
    }

    deleteCoupon(couponId: string) {
        return this.couponModel.findByIdAndDelete(couponId);
    }
}

export { CouponModel };