import express from "express";
import dotenv from "dotenv";

import connectMongoDB from "./db/connectMongoDB.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is runing on port ${PORT}`);
  connectMongoDB();
});
