import express from "express";
import { signup, logout, login, getMe } from "../controllers/authControler.js";
import { ProtectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", ProtectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
