import asyncHandler from "express-async-handler";
import { Router } from "express";
import { couponController } from "../config/AppContext";
import { authController } from "../config/AppContext";

const CouponRouter = Router();

CouponRouter.route("/")
    .post(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("admin").bind(authController)),
        asyncHandler(couponController.createCoupon.bind(couponController))
    )
    .get(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("admin").bind(authController)),
        asyncHandler(couponController.getCoupons.bind(couponController)));

CouponRouter.route("/:id")
    .get(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("admin").bind(authController)),
        asyncHandler(couponController.getCouponById.bind(couponController))
    )
    .put(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("admin").bind(authController)),
        asyncHandler(couponController.updateCoupon.bind(couponController))
    )
    .delete(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("admin").bind(authController)),
        asyncHandler(couponController.deleteCoupon.bind(couponController))
    );

export { CouponRouter };

