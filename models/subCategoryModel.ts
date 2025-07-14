import mongoose from "mongoose";
import { ISubCategory } from "../interfaces/subCategoryInterface";
import { getMongooseQueryFromRequest } from "../utils/apiFeatures";

class SubCategoriesModel {
  private subCategorySchema: mongoose.Schema;

  private subCategoryModel : mongoose.Model<any>;

  constructor() {
    this.subCategorySchema = new mongoose.Schema(
      {
        name: {
          type: String,
          required: [true, "SubCategory name is required"],
          unique: [true, "SubCategory must be Unique"],
          minLength: [3, "Too short SubCategory name"],
          maxLength: [32, "Too long SubCategory name"],
        },
        slug: {
          type: String,
          lowercase: true,
        },
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
        image: String,
      },
      { timestamps: true }
    );
    this.subCategorySchema.set("toJSON", {
      transform: function (doc, ret) {
        if (ret.image) {
          ret.image = `${process.env.BASE_URL}/subCategories/${ret.image}`;
        }
        return ret;
      },
    });

    this.subCategoryModel = mongoose.model("SubCategory", this.subCategorySchema);
  }

  createSubCategory(subCategory: ISubCategory) {
    return this.subCategoryModel.create(subCategory);
  }

  getSubCategory(requestQueryParams: any) {
    return getMongooseQueryFromRequest(this.subCategoryModel, requestQueryParams);
  }

  getSubCategoryById(id: string) {
    return this.subCategoryModel.findById(id);
  }

  updateSubCategory(id: string, newBody: any) {
    return this.subCategoryModel.findOneAndUpdate({ _id: id }, { ...newBody }, { new: true });
  }

  deleteSubCategory(id: string) {
    return this.subCategoryModel.findByIdAndDelete({ _id: id });
  }
}

export { SubCategoriesModel };
