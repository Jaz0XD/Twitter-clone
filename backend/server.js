//* Importing dependencies
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

//* Importing files
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import postRoutes from "./routes/post.route.js";
import notificationRoutes from "./routes/notification.route.js";

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

//* Importing cloudinary details
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const PORT = process.env.PORT || 5000;

//* limit: "5mb" to increase the limit of the image size or post size increase the number from 5 to any but not too large to avoid DoS attack
app.use(express.json({ limit: "5mb" })); //* To parse req.body

app.use(express.urlencoded({ extended: true })); //* To parse form data in POSTMAN
app.use(cookieParser());

// console.log(process.env.MONGO_URI);

//* API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
  console.log(`[server.js] Server is running on port ${PORT}`);
  connectMongoDB();
});
