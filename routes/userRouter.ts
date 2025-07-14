import { Router } from "express";
import { authController, userController } from "../config/AppContext";
import { uploadImage } from "../middlewares/uploadFileMiddleware";
import asyncHandler from "express-async-handler";
import {
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changePasswordValidator,
} from "../utils/validators/userValidator";


const UserRouter = Router();

UserRouter.route("/profile")
    .get(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(userController.getMe.bind(userController)),
        asyncHandler(userController.getUserById.bind(userController))
    );


UserRouter.route("/")
    .post(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("admin").bind(authController)),
        asyncHandler(uploadImage),
        createUserValidator,
        asyncHandler(userController.createUser.bind(userController))
    )
    .get(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("admin").bind(authController)),
        asyncHandler(userController.getUsers.bind(userController)));

UserRouter.put("/changepassword/:id", 
    changePasswordValidator,
    asyncHandler(userController.changePassword.bind(userController)));

UserRouter.route("/:id")
    .get(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("admin").bind(authController)),
        asyncHandler(userController.getUserById.bind(userController)))
    .put(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("admin").bind(authController)),
        asyncHandler(uploadImage),
        updateUserValidator,
        asyncHandler(userController.updateUser.bind(userController))
    )
    .delete(
        asyncHandler(authController.protectedRoute.bind(authController)),
        asyncHandler(authController.allowedRoles("admin").bind(authController)),
        deleteUserValidator,
        asyncHandler(userController.deleteUser.bind(userController)));


export { UserRouter };