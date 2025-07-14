import { Request, Response , NextFunction} from "express";
import { ReviewsModel } from "../models/reviewModel";
import { IReview } from "../interfaces/reviewInterface";
import { ApiError } from "../utils/apiError";

class ReviewController {

    private reviewModel: ReviewsModel;

    constructor(reviewModel: ReviewsModel) {
        this.reviewModel = reviewModel
    }

    // @desc Create new review
    // @route POST api/v1/Reviews
    // @access Private
    async createReview(req: Request, res: Response) {
     
        const review: IReview = { ...req.body };

        const response = await this.reviewModel.createReview(review);
        res.status(201).json({ data: response });
    }

    // @desc List all Reviews
    // @route GET api/v1/Reviews
    // @access Public
    async getReview(req: Request, res: Response) {
        const reviewList = await this.reviewModel.getAllReviews();
        res.status(201).json({ results: reviewList.length, data: reviewList });
    }

    // @desc get certain review
    // @route GET api/v1/Reviews/:id
    // @access Public
    async getReviewById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const review = await this.reviewModel.getReviewById(id);
        if(!review){
            return next(new ApiError(404, `review not found`));
        } 
        res.status(201).json({ data: review });
    }

    // @desc Update review
    // @route PUT api/v1/Reviews/:id
    // @access Private
    async updateReview(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const review = await this.reviewModel.updateReview(id, req.body);
        if(!review){
            return next(new ApiError(404, `review not found`));
        } 
        res.status(201).json({ data: review });
    }

    // @desc Delete review
    // @route DELETE api/v1/Reviews/:id
    // @access Private
    async deleteReview(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const review = await this.reviewModel.deleteReview(id);
        if(!review){
            return next(new ApiError(404, `review not found`));
        } 
        res.status(201).json({ data: review });
    }
    
}

export { ReviewController }