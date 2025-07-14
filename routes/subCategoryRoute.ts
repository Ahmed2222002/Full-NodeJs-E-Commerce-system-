import { Router }  from "express";
import { authController, subCategoryController } from "../config/AppContext";
import { uploadImage } from "../middlewares/uploadFileMiddleware";
import { setCategoryIdToBody } from "../middlewares/setCategoryIdToBody";
import asyncHandler from "express-async-handler";

import {
    getSubCategoryValidator,
    createSubCategoryValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator,
} from "../utils/validators/subCategoryValidator";

const SubCategoryRouter = Router({ mergeParams: true });

SubCategoryRouter.route("/")
  .post(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("admin").bind(authController)),
    asyncHandler(uploadImage),
    setCategoryIdToBody,
    createSubCategoryValidator,
    asyncHandler(subCategoryController.createSubCategory.bind(subCategoryController))
  )
  .get(asyncHandler(subCategoryController.getSubCategory.bind(subCategoryController)));

SubCategoryRouter.route("/:id")
  .get(
    getSubCategoryValidator,
    asyncHandler(subCategoryController.getSubCategoryById.bind(subCategoryController))
  )
  .put(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("admin").bind(authController)),
    asyncHandler(uploadImage),
    updateSubCategoryValidator,
    asyncHandler(subCategoryController.updateSubCategory.bind(subCategoryController))
  )
  .delete(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("admin").bind(authController)),
    deleteSubCategoryValidator,
    asyncHandler(subCategoryController.deleteSubCategory.bind(subCategoryController))
  );

export { SubCategoryRouter };