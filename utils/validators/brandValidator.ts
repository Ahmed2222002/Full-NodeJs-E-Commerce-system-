import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware";

const getBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id fromat"),
  validatorMiddleware,
];

const createBrandValidator = [
  check("name")
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Too short Brand name"),
  validatorMiddleware,
];

const updateBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id fromat"),
  check("name")
  .optional()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Too short Brand name"),
  validatorMiddleware,
];

const deleteBrandValidator = [
  check("id").isMongoId().withMessage("invalid Brand id fromat"),
  validatorMiddleware,
];

export {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
};
