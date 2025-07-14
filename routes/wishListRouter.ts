import asyncHandler from "express-async-handler";
import { Router } from "express";
import { wishListController, authController } from "../config/AppContext";

const WishListRouter = Router();

WishListRouter.route("/")
    .post(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("user").bind(authController)),
        asyncHandler(wishListController.addToWishList.bind(wishListController))
    )
    .get(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("user").bind(authController)),
        asyncHandler(wishListController.getWishList.bind(wishListController))
    )
    .delete(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("user").bind(authController)),
        asyncHandler(wishListController.removeFromWishList.bind(wishListController))
    );

export { WishListRouter };

