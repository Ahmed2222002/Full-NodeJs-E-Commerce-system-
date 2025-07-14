import { Router } from "express";
import asyncHandler from "express-async-handler";
import { authController } from "../config/AppContext"
import {
    signUpValidator,
    logInValidator
} from "../utils/validators/authValidator"

const authRouter = Router();

authRouter.route('/signUp')
    .post(
        signUpValidator,
        asyncHandler(authController.signup.bind(authController)),
    )

authRouter.route('/logIn')
    .post(
        logInValidator,
        asyncHandler(authController.logIn.bind(authController)),
    )

authRouter.route('/forgetPassword')
    .post(
        asyncHandler(authController.forgetPassword.bind(authController)),
    )

authRouter.route('/verifyOtp')
    .post(
        asyncHandler(authController.verifyOtp.bind(authController)),
    )

authRouter.route('/resetPassword')
    .post(
        asyncHandler(authController.resetPassword.bind(authController)),
    )

export { authRouter }

