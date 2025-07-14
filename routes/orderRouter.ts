import { Router } from "express";
import { ordersController } from "../config/AppContext";
import asyncHandler from "express-async-handler";
import { authController } from "../config/AppContext";

const OrderRouter = Router();

OrderRouter.route("/")
    .get(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("user", "admin").bind(authController)),
        asyncHandler(ordersController.getLoggedUserOrders.bind(ordersController)),
        asyncHandler(ordersController.getAllOrders.bind(ordersController))
    )

OrderRouter.route("/:cartId")
    .post(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("user").bind(authController)),
        asyncHandler(ordersController.createCashOrder.bind(ordersController))
    )

OrderRouter.route("/:orderId/pay")
    .put(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("admin").bind(authController)),
        asyncHandler(ordersController.updateOrderToPaid.bind(ordersController))
    )

OrderRouter.route("/:orderId/deliver")
    .put(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("admin").bind(authController)),
        asyncHandler(ordersController.updateOrderToDelivered.bind(ordersController))
    )

export { OrderRouter };