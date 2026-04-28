import express from "express";
import { getProfile, updateProfile } from "../controllers/user.controller.ts";
import { authMiddleware } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.use(authMiddleware);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

export default router;
