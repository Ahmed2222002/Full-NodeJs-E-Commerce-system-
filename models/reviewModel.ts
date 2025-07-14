import mongoose from 'mongoose';
import { Query } from 'mongoose';
import { IReview } from '../interfaces/reviewInterface';
class ReviewsModel {
    private reviewSchema: mongoose.Schema;
    private reviewModel: mongoose.Model<any>;

    constructor() {
        this.reviewSchema = new mongoose.Schema(
            {
                title: { type: String },
                ratings: {
                    type: Number,
                    min: [1, 'Min ratings value is 1.0'],
                    max: [5, 'Max ratings value is 5.0'],
                    required: [true, 'review ratings required'],
                },
                user: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'User',
                    required: [true, 'Review must belong to user'],
                },
                product: {
                    type: mongoose.Schema.ObjectId,
                    ref: 'Product',
                    required: [true, 'Review must belong to product'],
                },
            },
            { timestamps: true }
        );
        this.reviewSchema.pre(/^find/, function (this: Query<any, any>, next) {
            this.populate({ path: 'user', select: 'name' });
            next();
        });

        this.reviewModel = mongoose.model('Review', this.reviewSchema);
    }

    createReview(review: IReview) {
        return this.reviewModel.create(review);
    }

    getAllReviews() {
        return this.reviewModel.find();
    }

    getReviewById(id: string) {
        return this.reviewModel.findById(id);
    }

    updateReview(id: string, newBody: any) {
        return this.reviewModel.findOneAndUpdate({ _id: id }, newBody, { new: true });
    }

    deleteReview(id: string) {
        return this.reviewModel.findByIdAndDelete(id);
    }

    isUserHasReview(userId: string, productId: string) {
        return this.reviewModel.findOne({ user: userId, product: productId });
    }
}


export { ReviewsModel }


