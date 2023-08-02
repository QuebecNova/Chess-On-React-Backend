import mongoose from "mongoose";
import { app } from "./app";
import 'dotenv/config'

const PORT = process.env.PORT || 3001

const start = async () => {
  console.log('Starting...')
  
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY is not defined");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connected to DB");
  } catch (err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log("listening on port " + PORT);
  });
};

start();
