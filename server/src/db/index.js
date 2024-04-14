import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;
const DB_NAME = process.env.DB_NAME;
console.log("mongourl: ",   `${MONGO_URL}/${DB_NAME}`);

const connectToDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGO_URL}/${DB_NAME}`
    );

    console.log(
      `MongoDB connected! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection Failed! ", error);
    process.exit(1);
  }
};

export default connectToDb;
