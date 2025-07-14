import mongoose from 'mongoose';
import { IBrand } from '../interfaces/brandsInterface'
import { getMongooseQueryFromRequest } from "../utils/apiFeatures";
class BrandsModel {
    private brandSchema: mongoose.Schema;
    private brandModel : mongoose.Model<any>;

    constructor() {
        this.brandSchema = new mongoose.Schema(
        {
            name: {
                type: String,
                required: [true, 'brand  name is required'],
                unique: [true, 'brand must be Unique'],
                minLength: [3, 'Too short brand name'],
                maxLength: [32, 'Too long brand name']
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

        this.brandSchema.set('toJSON', {
            transform: function (doc, ret) {
                if (ret.image) {
                    ret.image = `${process.env.BASE_URL}/brands/${ret.image}`;
                }
                return ret;
            },
        });
        this.brandModel = mongoose.model('brand', this.brandSchema);
    }

    createBrand(brand: IBrand) {
        return this.brandModel.create(brand);
    }

    getBrand(filters: any) {
       return getMongooseQueryFromRequest(this.brandModel, filters);
    }

    getBrandById(id: string) {
        return this.brandModel.findById(id);
    }

    updateBrand(id: string, newBody: any) {
        return this.brandModel.findOneAndUpdate({ _id: id }, { ...newBody}, { new: true });
    }

    deleteBrand(id: string) {
        return this.brandModel.findByIdAndDelete({ _id: id });
    }
}


export { BrandsModel }


