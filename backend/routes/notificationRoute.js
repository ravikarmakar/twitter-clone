import express from "express";
import { ProtectRoute } from "../middleware/protectRoute.js";
import {
  deleteNotification,
  getNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", ProtectRoute, getNotification);
router.delete("/", ProtectRoute, deleteNotification);

export default router;
