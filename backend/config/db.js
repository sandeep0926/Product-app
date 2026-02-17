import mongoose from "mongoose";

export const ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("MONGODB IS CONNECTED...");
  } catch (error) {
    console.log("MONGODB NOT CONNECTED...", error);
  }
};