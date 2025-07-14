import { check } from "express-validator";
import { reviewModel } from "../../config/AppContext";
import { validatorMiddleware } from "../../middlewares/validatorMiddleware";
import { ApiError } from "../apiError";

const createReviewValidator = [
  check("product")
    .isMongoId().withMessage("invalid product id format")
    .custom(async (val, { req }) => {
      const review = await reviewModel.isUserHasReview(req.user._id, req.body.product);
      if (review) {
        throw new Error("You already created a review before");
      }
    }),

  check("ratings")
    .isNumeric().withMessage("rating must be a number")
    .isFloat({ min: 1.0, max: 5.0 }).withMessage("Rating must be between 1.0 and 5.0"),

  check("user").isMongoId().withMessage("invalid user id format"),

  validatorMiddleware,
];



const getReviewValidator = [
    check("id").isMongoId().withMessage("invalid review id fromat"),
    validatorMiddleware,
];

const updateReviewValidator = [
    check("id").isMongoId().withMessage("invalid review id fromat")
        .custom(async(val, { req }) => {
            const review = await reviewModel.getReviewById(val)
                if (!review) {
                   throw new Error("review not found");
                }
                if (review?.user._id.toString() !== req.user._id.toString()) {
                    throw new Error("You are not allowed to update this review");
                }
        }),
    validatorMiddleware,
];

const deleteReviewValidator = [
    check("id").isMongoId().withMessage("invalid review id fromat")
        .custom(async(val, { req }) => {
           const review = await reviewModel.getReviewById(val)
                if (!review) {
                    throw new Error("review not found");
                }
                if (req.user.role === "user") {

                    if (review?.user._id.toString() !== req.user._id.toString()) {
                      throw new Error("You are not allowed to delete this review");
                    }
                }

       
            return true;
        }),
    validatorMiddleware,
];

export {
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator,
};