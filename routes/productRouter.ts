import { Router } from "express";
import { authController, productController } from "../config/AppContext";
import { uploadProductImages } from "../middlewares/uploadFileMiddleware";
import asyncHandler from "express-async-handler";
import {
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} from "../utils/validators/productValidator";

const ProductRouter = Router();

ProductRouter.route("/")
  .post(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("admin").bind(authController)),
    asyncHandler(uploadProductImages),
    createProductValidator,
    asyncHandler(productController.createProduct.bind(productController))
  )
  .get(asyncHandler(productController.getProducts.bind(productController)));

ProductRouter.route("/:id")
  .get(
    getProductValidator,
    asyncHandler(productController.getProductById.bind(productController))
  )
  .put(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("admin").bind(authController)),
    asyncHandler(uploadProductImages),
    updateProductValidator,
    asyncHandler(productController.updateProduct.bind(productController))
  )
  .delete(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("admin").bind(authController)),
    deleteProductValidator,
    asyncHandler(productController.deleteProduct.bind(productController))
  );

export { ProductRouter };
