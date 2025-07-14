import { check } from "express-validator";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware";
import { categoriesModel, subCategoriesModel } from "../../config/AppContext";
import slugify from "slugify";
import mongoose from "mongoose";

const createProductValidator = [
  check("title")
    .isLength({ min: 3 })
    .withMessage("must be at least 3 chars")
    .notEmpty()
    .withMessage("Product required")
    .custom((val, { req }) => {
      console.log(req.body);
      req.body.slug = slugify(val);
      return true;
    }),
  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ max: 2000 })
    .withMessage("Too long description"),
  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("Product price must be a number")
    .isLength({ max: 32 })
    .withMessage("To long price"),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Product priceAfterDiscount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error("priceAfterDiscount must be lower than price");
      }
      return true;
    }),

  check("colors")
    .optional()
    .isArray()
    .withMessage("availableColors should be array of string"),
  check("imageCover").notEmpty().withMessage("Product imageCover is required"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images should be array of string"),
  check("category")
    .notEmpty()
    .withMessage("Product must be belong to a category")
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom((categoryId) =>
      categoriesModel.getcategoryById(categoryId).then((category) => {
        if (!category) {
          return Promise.reject(
            new Error(`No category for this id: ${categoryId}`)
          );
        }
      })
    ),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid ID formate")
    .custom(async (subCategoryId) => {
      const ids = Array.isArray(subCategoryId)
        ? subCategoryId
        : [subCategoryId];
      // check if all ids are valid
      for (const id of ids) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
          throw new Error(`Invalid ID formate: ${id}`);
        }
      }
      // check if all subCategories exist
      for (const id of ids) {
        const subCategory = await subCategoriesModel.getSubCategoryById(id);
        if (!subCategory) {
          throw new Error(`No subCategory for this id: ${id}`);
        }
      }
    })
    .custom(async (subCategoryIds, { req }) => {
      const categoryId = req.body.category;

      // Ensure subCategoryIds is an array
      const idsToCheck = Array.isArray(subCategoryIds)
        ? subCategoryIds
        : [subCategoryIds];

      // Get valid subcategories for the category
      const subCategories = await subCategoriesModel.getSubCategory(
        { category: categoryId },
      );
      const validSubCategoryIds = subCategories.map((subCat: any) =>
        subCat._id.toString()
      );

      // Check if all provided IDs exist in valid list
      const areAllValid = idsToCheck.every((id: string) =>
        validSubCategoryIds.includes(id)
      );

      if (!areAllValid) {
        throw new Error(
          `Some subCategory IDs do not belong to the specified category: ${categoryId}`
        );
      }

      return true; // Required to indicate validation success
    }),
  check("brand").optional().isMongoId().withMessage("Invalid ID formate"),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .withMessage("ratingsAverage must be a number")
    .isLength({ min: 1 })
    .withMessage("Rating must be above or equal 1.0")
    .isLength({ max: 5 })
    .withMessage("Rating must be below or equal 5.0"),
  check("ratingsQuantity")
    .optional()
    .isNumeric()
    .withMessage("ratingsQuantity must be a number"),

  validatorMiddleware,
];

const getProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

const updateProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

const deleteProductValidator = [
  check("id").isMongoId().withMessage("Invalid ID formate"),
  validatorMiddleware,
];

export {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
};
