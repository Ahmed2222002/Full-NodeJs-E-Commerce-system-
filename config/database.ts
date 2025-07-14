import mongoose from "mongoose";

// ** Database connection
const dbConnection = () => {
  if (process.env.DB_URL) {
    mongoose
      .connect(process.env.DB_URL)
      .then((conn) => {
        console.log(`Database Connected: ${conn.connection.host}`);
      })
      .catch((err) => {
        console.log(`Database Error: ${err}`);
      });
  } else {
    console.log("Conn't find database connection string");
  }
};

export { dbConnection };
