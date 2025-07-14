import mongoose from 'mongoose';
import { ICategory } from '../interfaces/categoryInterface'
import { getMongooseQueryFromRequest } from "../utils/apiFeatures";
class CategoriesModel {
    
    private categorySchema : mongoose.Schema;
    private categoryModel : mongoose.Model<any>;

    constructor() {
        this.categorySchema = new mongoose.Schema(
        {
            name: {
                type: String,
                required: [true, 'Category  name is required'],
                unique: [true, 'Category must be Unique'],
                minLength: [3, 'Too short category name'],
                maxLength: [32, 'Too long category name']
            },
            slug: {
                type: String,
                lowercase: true,
            },
            image: String
        },

        {
            timestamps: true
        });

        this.categorySchema.set('toJSON', {
            transform: function (doc, ret) {
                if (ret.image) {
                    ret.image = `${process.env.BASE_URL}/categories/${ret.image}`;
                }
                return ret;
            },
        });

        this.categoryModel = mongoose.model('Category', this.categorySchema);
    }

    createCategory(category: ICategory) {
        return this.categoryModel.create(category);
    }

    getcategory(filters: any) {
        return getMongooseQueryFromRequest(this.categoryModel, filters);
    }

    getcategoryById(id: string) {
        return this.categoryModel.findById(id);
    }

    updateCategory(id: string, requestBody: any) {
        return this.categoryModel.findOneAndUpdate({ _id: id }, {...requestBody}, { new: true });
    }

    deleteCategory(id: string) {
        return this.categoryModel.findByIdAndDelete({ _id: id });
    }
}


export { CategoriesModel }


