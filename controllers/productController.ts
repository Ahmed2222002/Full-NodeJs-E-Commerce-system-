import { Request, Response, NextFunction } from "express";
import { ProductsModel } from "../models/productModel";
import { IProduct } from "../interfaces/productInterface";
import { ApiError } from "../utils/apiError";
import slugify from "slugify";
import qs from "qs";

class ProductController {
  private productModel: ProductsModel;

  constructor(productModel: ProductsModel) {
    this.productModel = productModel;
  }

  private productAllowedFilterFields = ["title","price","category","subCategory","brand","sold","ratingsAverage"];

  // @desc Create new product
  // @route POST api/v1/products
  // @access Private
  async createProduct(req: Request, res: Response, next: NextFunction) {
    const product: IProduct = req.body;
    const newProduct = await this.productModel.createProduct(product);
    res.status(201).json({ data: newProduct });
  }

  // @desc List all products
  // @route GET api/v1/products
  // @access Public
  async getProducts(req: Request, res: Response) {
    
    const rawFilter = qs.parse(req.url.split('?')[1] || '', { ignoreQueryPrefix: true });

    rawFilter.allowedFilterFields = this.productAllowedFilterFields;

    const products = await this.productModel.getProducts(rawFilter);
    res.status(201).json({ results: products.length, page: rawFilter.page, data: products });
    
  }


  // @desc get certain product
  // @route GET api/v1/products/:id
  // @access Public
  async getProductById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const product = await this.productModel.getProductById(id);
    if (!product) {
      return next(new ApiError(404, "Product not found"));
    }
    res.status(201).json({ data: product });
  }

  // @desc Update product
  // @route PUT api/v1/products/:id
  // @access Private
  async updateProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    if (req.body.title) {
      req.body.slug = slugify(req.body.title);
    }
    const updatedProduct = await this.productModel.updateProduct(id, req.body);
    res.status(201).json({ data: updatedProduct });
  }

  // @desc Delete product
  // @route DELETE api/v1/products/:id
  // @access Private
  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const deletedProduct = await this.productModel.deleteProduct(id);
    res.status(201).json({ data: deletedProduct });
  }
}

export { ProductController };
