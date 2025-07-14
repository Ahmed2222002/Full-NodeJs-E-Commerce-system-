import { Router } from "express";
import { cartController } from "../config/AppContext";
import { authController } from "../config/AppContext";
import asyncHandler from "express-async-handler";

const CartRouter = Router();

CartRouter.route("/")
    .post(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("user").bind(authController)),
        asyncHandler(cartController.addProductToCart.bind(cartController))
    )
    .get(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("user").bind(authController)),
        asyncHandler(cartController.getLoggedUserCart.bind(cartController))
    )
    .delete(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("user").bind(authController)),
        asyncHandler(cartController.clearCart.bind(cartController))
    );

CartRouter.route("/applayCoupon")
    .post(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("user").bind(authController)),
        asyncHandler(cartController.applayCoupon.bind(cartController))
    )

CartRouter.route("/:itemId")
    .put(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("user").bind(authController)),
        asyncHandler(cartController.updateCartItemQuantity.bind(cartController))
    )
    .delete(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("user").bind(authController)),
        asyncHandler(cartController.removeProductFromCart.bind(cartController))
    );

export { CartRouter };