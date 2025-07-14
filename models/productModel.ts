import mongoose from "mongoose";
import { IProduct } from "../interfaces/productInterface";
import { getMongooseQueryFromRequest } from "../utils/apiFeatures";


class ProductsModel {
  private productSchema: mongoose.Schema;
  private productModel: mongoose.Model<any>;

  constructor() {
    this.productSchema = new mongoose.Schema(
      {
        title: {
          type: String,
          required: [true, "product title is required"],
          trim: true,
          minLength: [3, "Too short product title"],
          maxLength: [100, "Too long product title"],
        },
        slug: {
          type: String,
          required: true,
          lowercase: true,
        },
        description: {
          type: String,
          required: [true, "product description is required"],
          minLength: [3, "Too short product description"],
          maxLength: [2000, "Too long product description"],
        },
        quntity: {
          type: Number,
          required: [true, "product quntity is required"],
          default: 0,
        },
        sold: {
          type: Number,
          default: 0,
        },
        price: {
          type: Number,
          required: [true, "product price is required"],
          trim: true,
          min: [1, "Too small product price"],
          default: 1,
        },
        priceActerDiscount: {
          type: Number,
          default: 0,
        },
        colors: [String],
        imageCover: {
          type: String,
          required: [true, "product imageCover is required"],
        },
        images: [String],
        category: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
          required: true,
        },
        subCategory: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubCategory",
        }],
        brand: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "brand",
        },
        ratingsAverage: {
          type: Number,
          min: [1, "rating must be above or qual to 1"],
          max: [5, "rating must be below or qual to 5"],
          default: 0,
        },
        ratingQuantity: {
          type: Number,
          default: 0,
        },
      },
      {
        timestamps: true,
        toJSON: {
          virtuals: true,
          transform: function (doc, ret) {
            if (ret.imageCover) {
              ret.imageCover = `${process.env.BASE_URL}/products/${ret.imageCover}`;
            }
            if (ret.images) {
              ret.images = ret.images.map((image: string) => `${process.env.BASE_URL}/products/${image}`);
            }
            return ret;
          }
        },
        toObject: {
          virtuals: true
        }
      }
    );

    this.productSchema.virtual("reviews", {
      ref: "Review",
      localField: "_id",
      foreignField: "product",
      justOne: false,
    });

    this.productModel = mongoose.model("Product", this.productSchema);
  }

  createProduct(product: IProduct) {
    return this.productModel.create(product);
  }

  getProducts(filters: any) {

    return getMongooseQueryFromRequest(this.productModel, filters);
  }


  getProductById(id: string) {
    let query = this.productModel.findById(id);
    query = query.populate("reviews");
    return query;
  }

  updateProduct(id: string, product: IProduct) {
    return this.productModel.findOneAndUpdate({ _id: id }, { ...product }, { new: true });
  }

  deleteProduct(id: string) {
    return this.productModel.findByIdAndDelete({ _id: id });
  }

  deleteAllProducts() {
    return this.productModel.deleteMany({});
  }

  getProductModel() {
    return this.productModel;
  }
}

export { ProductsModel };
