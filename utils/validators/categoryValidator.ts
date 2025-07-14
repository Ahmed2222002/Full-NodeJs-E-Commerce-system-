import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware";

const getCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id fromat"),
  validatorMiddleware,
];

const createCategoryValidator = [
  check("name")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Too short category name"),
  validatorMiddleware,
];

const updateCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id fromat"),
  check("name")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Too short category name"),
  validatorMiddleware,
];

const deleteCategoryValidator = [
  check("id").isMongoId().withMessage("invalid category id fromat"),
  validatorMiddleware,
];

export {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
};
