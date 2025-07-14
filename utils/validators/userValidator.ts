import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware";

const getUserValidator = [
    check("id").isMongoId().withMessage("invalid User id fromat"),
    validatorMiddleware,
];

const createUserValidator = [
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
    
    check("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number"),
    check("image")
        .optional(),
    check("role")
        .optional()
        .isIn(["user", "admin"])
        .withMessage("Invalid role"),
        
    validatorMiddleware,
];

const updateUserValidator = [
    check("id").isMongoId().withMessage("invalid User id fromat"),
    check("name")
        .optional()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Too short User name"),
    check("phone")
        .optional()
        .isMobilePhone(["ar-EG", "ar-SA"])
        .withMessage("Invalid phone number"),
    check("image")
        .optional(),
    check("role")
        .optional()
        .isIn(["user", "admin"])
        .withMessage("Invalid role"),
    validatorMiddleware,
];

const changePasswordValidator = [
    check("id").isMongoId().withMessage("invalid User id fromat"),
    check("currentPassword")
        .notEmpty()
        .withMessage("currentPassword is rquired"),
    check("password")
        .notEmpty()
        .withMessage("password is rquired"),
    check("confirmPassword")
        .notEmpty()
        .withMessage("confirmPassword is rquired")
        .custom((val, { req }) => {
            if (val !== req.body.password) {
                throw new Error("passwords do not match");
            }
            return true;
        }),
    validatorMiddleware
]

const deleteUserValidator = [
    check("id").isMongoId().withMessage("invalid User id fromat"),
    validatorMiddleware,
];

export {
    getUserValidator,
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changePasswordValidator,
};