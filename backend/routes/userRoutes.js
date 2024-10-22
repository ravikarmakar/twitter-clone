import express from "express";
import { ProtectRoute } from "../middleware/protectRoute.js";
import {
  getUserProfile,
  getSuggestedUsers,
  followUnfollowUser,
  updateUser,
} from "../controllers/userControler.js";

const routes = express.Router();

routes.get("/profile/:username", ProtectRoute, getUserProfile);
routes.get("/suggested", ProtectRoute, getSuggestedUsers);
routes.post("/follow/:id", ProtectRoute, followUnfollowUser);
routes.post("/update", ProtectRoute, updateUser);

export default routes;
