// import mongoose from "mongoose";

// const connectDB = async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/quickgpt`);
//     console.log("database connected ");
//   } catch (error) {
//     console.log("DB Error:", error.message);
//   }
// };

// export default connectDB;

import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("Database connected")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/quickgpt`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
