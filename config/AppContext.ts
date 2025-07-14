import { CategoryController } from "../controllers/categoriesController";
import { SubCategoryController } from "../controllers/subCategoriesController";
import { CategoriesModel } from "../models/categoriesModel";
import { SubCategoriesModel } from "../models/subCategoryModel";
import { BrandsModel } from "../models/brandsModel";
import { BrandController } from "../controllers/brandsController";
import { ProductsModel } from "../models/productModel";
import { ProductController } from "../controllers/productController";
import { UsersModel } from "../models/usersModel";
import { UserController } from "../controllers/userController";
import { AuthController } from "../controllers/authController"
import { ReviewsModel } from "../models/reviewModel";
import { ReviewController } from "../controllers/reviewController";
import { WishListController } from "../controllers/wishListController";
import { CouponModel } from "../models/couponModel";
import { CouponController } from "../controllers/couponController";
import { CartModel } from "../models/cartModel";
import { CartController } from "../controllers/cartController";
import { OrdersModel } from "../models/orderModel";
import { OrdersController } from "../controllers/orderController";

const categoriesModel = new CategoriesModel();
const categoryController = new CategoryController(categoriesModel);

const subCategoriesModel = new SubCategoriesModel();
const subCategoryController = new SubCategoryController(subCategoriesModel);

const brandsModel = new BrandsModel();
const brandController = new BrandController(brandsModel);

const productsModel = new ProductsModel();
const productController = new ProductController(productsModel);

const userModel = new UsersModel();
const userController = new UserController(userModel);

const authController = new AuthController();

const reviewModel = new ReviewsModel();
const reviewController = new ReviewController(reviewModel);

const wishListController = new WishListController();

const couponModel = new CouponModel();
const couponController = new CouponController(couponModel);

const cartModel = new CartModel();
const cartController = new CartController(cartModel);

const ordersModel = new OrdersModel();
const ordersController = new OrdersController(ordersModel);

export {
  subCategoriesModel,
  categoriesModel,
  categoryController,
  subCategoryController,
  brandController,
  productController,
  productsModel,
  userController,
  userModel,
  authController,
  reviewController,
  reviewModel,
  wishListController,
  couponController,
  couponModel,
  cartController,
  cartModel,
  ordersController,
  ordersModel
};
