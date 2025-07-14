import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware";

const getSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subcategory id fromat"),
  validatorMiddleware,
];

const createSubCategoryValidator = [
  check("name")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Too short subcategory name"),
  check("category").notEmpty().isMongoId().withMessage("invalid category id fromat"),
  validatorMiddleware,
];

const updateSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subcategory id fromat"),
  check("name")
    .optional()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Too short subcategory name"),
  validatorMiddleware,
];

const deleteSubCategoryValidator = [
  check("id").isMongoId().withMessage("invalid subcategory id fromat"),
  validatorMiddleware,
];

export {
  getSubCategoryValidator,
  createSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
};
