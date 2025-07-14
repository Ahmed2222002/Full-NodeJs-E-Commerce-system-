import { check } from "express-validator";

import { validatorMiddleware } from "../../middlewares/validatorMiddleware";

const signUpValidator = [
    check("name")
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Too short User name"),
    check("email")
        .notEmpty()
        .withMessage("email is rquired")
        .isEmail()
        .withMessage("Invalid email"),
    check("password")
        .notEmpty()
        .withMessage("password is rquired")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 chars long")
        .custom((val, { req }) => {
            if (val !== req.body.confirmPassword) {
                throw new Error("passwords do not match");
            }
            return true;
        }),

    check("confirmPassword")
        .notEmpty()
        .withMessage("confirmPassword is rquired"),

    validatorMiddleware
]

const logInValidator = [
    check("email")
        .notEmpty()
        .withMessage("email is rquired")
        .isEmail()
        .withMessage("Invalid email"),
    check("password")
        .notEmpty()
        .withMessage("password is rquired")
        .isLength({ min: 6 })
        .withMessage("password must be at least 6 chars long"),
    validatorMiddleware
]

export { signUpValidator, logInValidator }