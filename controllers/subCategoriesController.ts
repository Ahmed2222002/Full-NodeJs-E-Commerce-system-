import { Request, Response, NextFunction } from "express";
import { SubCategoriesModel } from "../models/subCategoryModel";
import { ISubCategory } from "../interfaces/subCategoryInterface";
import slugify from "slugify";
import { ApiError } from "../utils/apiError";
import qs from "qs";

class SubCategoryController {
  private subCategoryModel: SubCategoriesModel;

  constructor(subCategoryModel: SubCategoriesModel) {
    this.subCategoryModel = subCategoryModel;
  }

  // @desc Create new SubCategory
  // @route POST api/v1/subCategories
  // @access Private
  async createSubCategory(req: Request, res: Response) {
    const subCategory: ISubCategory = {
      name: req.body.name,
      slug: slugify(req.body.name),
      category: req.body.category ? req.body.category : req.params.categoryId,
      image: req.body.image,
    };

    const response = await this.subCategoryModel.createSubCategory(subCategory);

    res.status(201).json({ data: response });
  }

  // @desc List all SubCategories
  // @route GET api/v1/subCategories
  // @access Public
  async getSubCategory(req: Request, res: Response, next: NextFunction) {

     let rawFilter = qs.parse(req.url.split('?')[1] || '', { ignoreQueryPrefix: true });
        rawFilter.category = req.params.categoryId ;
    const subCategoryList = await this.subCategoryModel.getSubCategory(rawFilter);
    if(!subCategoryList){
        return next(new ApiError(404, `SubCategory not found`));
    } 
    res.status(201).json({ results: subCategoryList.length, page: rawFilter.page, data: subCategoryList });
  }

  // @desc get certain SubCategory
  // @route GET api/v1/subCategories/:id
  // @access Public
  async getSubCategoryById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const subCategory = await this.subCategoryModel.getSubCategoryById(id);
    if(!subCategory){
        return next(new ApiError(404, `SubCategory not found`));
    } 
    res.status(201).json({ data: subCategory });
  }

  // @desc Update SubCategory
  // @route PUT api/v1/subCategories/:id
  // @access Private
  async updateSubCategory(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const subCategory = await this.subCategoryModel.updateSubCategory(id, req.body);
    if(!subCategory){
        return next(new ApiError(404, `SubCategory not found`));
    } 
    res.status(201).json({ data: subCategory });
  }

  // @desc Delete SubCategory
  // @route DELETE api/v1/subCategories/:id
  // @access Private
  async deleteSubCategory(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const subCategory = await this.subCategoryModel.deleteSubCategory(id);
    if(!subCategory){
        return next(new ApiError(404, `SubCategory not found`));
    } 
    res.status(201).json({ data: subCategory });
  }
}

export { SubCategoryController };
