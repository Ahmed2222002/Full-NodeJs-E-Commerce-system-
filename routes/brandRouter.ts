import { Router } from "express";
import { brandController } from "../config/AppContext";
import { uploadImage } from "../middlewares/uploadFileMiddleware";
import { authController } from "../config/AppContext";
import asyncHandler from "express-async-handler";
import {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} from "../utils/validators/brandValidator";
const BrandRouter = Router();


BrandRouter.route("/")
  .post(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("admin").bind(authController)),
    asyncHandler(uploadImage),
    createBrandValidator,
    asyncHandler(brandController.createBrand.bind(brandController))
  )
  .get(asyncHandler(brandController.getBrand.bind(brandController)));

BrandRouter.route("/:id")
  .get(
    getBrandValidator,
    asyncHandler(brandController.getBrandById.bind(brandController))
  )
  .put(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("admin").bind(authController)),
    asyncHandler(uploadImage),
    updateBrandValidator,
    asyncHandler(brandController.updateBrand.bind(brandController))
  )
  .delete(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("admin").bind(authController)),
    deleteBrandValidator,
    asyncHandler(brandController.deleteBrand.bind(brandController))
  );

export { BrandRouter };

