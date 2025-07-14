import { Router } from "express";
import { categoryController } from "../config/AppContext";
import { SubCategoryRouter } from "./subCategoryRoute";
import { uploadImage } from "../middlewares/uploadFileMiddleware";
import { authController } from "../config/AppContext";
import asyncHandler from "express-async-handler";
import {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} from "../utils/validators/categoryValidator";
const CategoryRouter = Router();

CategoryRouter.use("/:categoryId/subCategories", SubCategoryRouter);

CategoryRouter.route("/")
  .post(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("admin").bind(authController)),
    asyncHandler(uploadImage),
    createCategoryValidator,
    asyncHandler(categoryController.createCategory.bind(categoryController))
  )
  .get(asyncHandler(categoryController.getCategory.bind(categoryController)));

CategoryRouter.route("/:id")
  .get(
    getCategoryValidator,
    asyncHandler(categoryController.getCategoryById.bind(categoryController))
  )
  .put(
    asyncHandler(uploadImage),
    updateCategoryValidator,
    asyncHandler(categoryController.updateCategory.bind(categoryController))
  )
  .delete(
    deleteCategoryValidator,
    asyncHandler(categoryController.deleteCategory.bind(categoryController))
  );

export { CategoryRouter };
