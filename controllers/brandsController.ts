import { Request, Response , NextFunction} from "express";
import { BrandsModel } from "../models/brandsModel";
import { IBrand } from "../interfaces/brandsInterface";
import slugify from "slugify";
import { ApiError } from "../utils/apiError";
import qs from "qs";


class BrandController {

    private brandModel: BrandsModel;

    constructor(brandModel: BrandsModel) {
        this.brandModel = brandModel
    }

    // @desc Create new brand
    // @route POST api/v1/Brands
    // @access Private
    async createBrand(req: Request, res: Response) {
        const name = req.body.name;
        const brand: IBrand = { name, slug: slugify(name), image: req.body.image };

        const response = await this.brandModel.createBrand(brand);
        res.status(201).json({ data: response });
    }

    // @desc List all Brands
    // @route GET api/v1/Brands
    // @access Public
    async getBrand(req: Request, res: Response) {

       const rawFilter = qs.parse(req.url.split('?')[1] || '', { ignoreQueryPrefix: true });
        const brandList = await this.brandModel.getBrand(rawFilter);
        res.status(201).json({ results: brandList.length, page: rawFilter.page, data: brandList });
    }

    // @desc get certain brand
    // @route GET api/v1/Brands/:id
    // @access Public
    async getBrandById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const brand = await this.brandModel.getBrandById(id);
        if(!brand){
            return next(new ApiError(404, `brand not found`));
        } 
        res.status(201).json({ data: brand });
    }

    // @desc Update brand
    // @route PUT api/v1/Brands/:id
    // @access Private
    async updateBrand(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const brand = await this.brandModel.updateBrand(id, req.body);
        if(!brand){
            return next(new ApiError(404, `brand not found`));
        } 
        res.status(201).json({ data: brand });
    }

    // @desc Delete brand
    // @route DELETE api/v1/Brands/:id
    // @access Private
    async deleteBrand(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const brand = await this.brandModel.deleteBrand(id);
        if(!brand){
            return next(new ApiError(404, `brand not found`));
        } 
        res.status(201).json({ data: brand });
    }
    
}

export { BrandController }