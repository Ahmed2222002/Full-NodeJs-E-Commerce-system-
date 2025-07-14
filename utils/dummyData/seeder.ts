import fs from "fs";
import colors from "colors";
import dotenv from "dotenv";
import { productsModel } from "../../config/AppContext";
import { dbConnection } from "../../config/database";

dotenv.config({ path: "../../config.env" });

// connect to DB
dbConnection();

// Read data
const products = JSON.parse(fs.readFileSync("./products.json").toString());

// Insert data into DB
const insertData = async () => {
  try {
    for (let i = 0; i < products.length; i++) {
      await productsModel.createProduct(products[i]);
    }
    console.log("Data Inserted");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await productsModel.deleteAllProducts();
    console.log("Data Destroyed");
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === "-i") {
  insertData();
} else if (process.argv[2] === "-d") {
  destroyData();
}
