import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectMongoDB from "./db/connectMongoDB.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // to parse form data(urlencoded)
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`);
  connectMongoDB();
});
