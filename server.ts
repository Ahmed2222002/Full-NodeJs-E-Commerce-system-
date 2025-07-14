import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import path from "path";

import { Request, Response, NextFunction } from "express";
import { ApiError } from "./utils/apiError";
import { dbConnection } from "./config/database";
import { CategoryRouter } from "./routes/categoryRoute";
import { SubCategoryRouter } from "./routes/subCategoryRoute";
import { BrandRouter } from "./routes/brandRouter";
import { ProductRouter } from "./routes/productRouter";
import { globalErrorHndler } from "./middlewares/errorMiddleware";
import { UserRouter } from "./routes/userRouter";
import { authRouter } from "./routes/authRouter";
import { ReviewRouter } from "./routes/reviewRouter";
import { WishListRouter } from "./routes/wishListRouter";
import { CouponRouter } from "./routes/couponRouter";
import { CartRouter } from "./routes/cartRouter";
import { OrderRouter } from "./routes/orderRouter";

dotenv.config({ path: "config.env" });

// start database connection
dbConnection();

const app = express();

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "uploads")));

app.use("/api/v1/categories", CategoryRouter);
app.use("/api/v1/subCategories", SubCategoryRouter);
app.use("/api/v1/brands", BrandRouter);
app.use("/api/v1/products", ProductRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/reviews", ReviewRouter);
app.use("/api/v1/wishlists", WishListRouter);
app.use("/api/v1/coupons", CouponRouter);
app.use("/api/v1/carts", CartRouter);
app.use("/api/v1/orders", OrderRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  const error = new ApiError(404, `Can't find this route: ${req.originalUrl}`);
  next(error);
});

// Global Error handling middleware from express
app.use(globalErrorHndler);

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// handle Error outside express
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection error: ${err}`);
  server.close(() => {
    console.log("server shutting down...");
    process.exit(1);
  });
});
