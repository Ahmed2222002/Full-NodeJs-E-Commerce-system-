import asyncHandler from "express-async-handler";
import { Router } from "express";
import { reviewController } from "../config/AppContext";
import { authController } from "../config/AppContext";

import {
  createReviewValidator,
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
} from "../utils/validators/reviewValidator";

const ReviewRouter = Router();


ReviewRouter.route("/")
  .post(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("user").bind(authController)),
    createReviewValidator,
    asyncHandler(reviewController.createReview.bind(reviewController))
  )
  // any user can see all reviews for any product
  .get(
    asyncHandler(reviewController.getReview.bind(reviewController))
  );

ReviewRouter.route("/:id")
  .get(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("admin").bind(authController)),
    getReviewValidator,
    asyncHandler(reviewController.getReviewById.bind(reviewController))
  )
  .put(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("user").bind(authController)),
    updateReviewValidator,
    asyncHandler(reviewController.updateReview.bind(reviewController))
  )
  .delete(
    asyncHandler(authController.protectedRoute.bind(authController)),
    asyncHandler(authController.allowedRoles("admin", "user").bind(authController)),
    deleteReviewValidator,
    asyncHandler(reviewController.deleteReview.bind(reviewController))
  );

export { ReviewRouter };

