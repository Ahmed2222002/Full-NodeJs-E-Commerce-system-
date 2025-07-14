import { Request, Response , NextFunction} from "express";
import { CategoriesModel } from "../models/categoriesModel";
import { ICategory } from "../interfaces/categoryInterface";
import slugify from "slugify";
import { ApiError } from "../utils/apiError";
import qs from "qs";

class CategoryController {

    private categoryModel: CategoriesModel;

    constructor(categoryModel: CategoriesModel) {
        this.categoryModel = categoryModel
    }

    // @desc Create new Category
    // @route POST api/v1/categories
    // @access Private
    async createCategory(req: Request, res: Response) {
        const name = req.body.name;
        const imageName = req.body.image? req.body.image : "#";
        const category: ICategory = { name, slug: slugify(name), image: imageName };
        const response = await this.categoryModel.createCategory(category);
        res.status(201).json({ data: response });
    }

    // @desc List all Categories
    // @route GET api/v1/categories
    // @access Public
    async getCategory(req: Request, res: Response) {

        const rawFilter = qs.parse(req.url.split('?')[1] || '', { ignoreQueryPrefix: true });
        const categoryList = await this.categoryModel.getcategory(rawFilter);
        res.status(201).json({ results: categoryList.length, page: rawFilter.page, data: categoryList });
    }

    // @desc get certain Category
    // @route GET api/v1/categories/:id
    // @access Public
    async getCategoryById(req: Request, res: Response, next: NextFunction) {
        const { id } = req.params
        const category = await this.categoryModel.getcategoryById(id);
        if(!category){
            return next(new ApiError(404, `Category not found`));
        } 
        res.status(201).json({ data: category });
    }

    // @desc Update Category
    // @route PUT api/v1/categories/:id
    // @access Private
    async updateCategory(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        if(req.body.name){
            req.body.slug = slugify(req.body.name);
        }
        const category = await this.categoryModel.updateCategory(id, req.body);
        if(!category){
            return next(new ApiError(404, `Category not found`));
        } 
        res.status(201).json({ data: category });
    }

    // @desc Delete Category
    // @route DELETE api/v1/categories/:id
    // @access Private
    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        const id = req.params.id;
        const category = await this.categoryModel.deleteCategory(id);
        if(!category){
            return next(new ApiError(404, `Category not found`));
        } 
        res.status(201).json({ data: category });
    }
    
}

export { CategoryController }