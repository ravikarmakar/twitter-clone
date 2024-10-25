import express from "express";
import { ProtectRoute } from "../middleware/protectRoute.js";

import {
  createPost,
  deletePost,
  commentOnPost,
  likeUnlikePost,
  getAllPost,
  getLikedPost,
  getFollowingPosts,
  getUserPost,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/all", ProtectRoute, getAllPost);
router.get("/following", ProtectRoute, getFollowingPosts);
router.get("/likes/:id", ProtectRoute, getLikedPost);
router.get("/user/:username", ProtectRoute, getUserPost);
router.post("/create", ProtectRoute, createPost);
router.post("/like/:id", ProtectRoute, likeUnlikePost);
router.post("/comment/:id", ProtectRoute, commentOnPost);
router.delete("/:id", ProtectRoute, deletePost);

export default router;
