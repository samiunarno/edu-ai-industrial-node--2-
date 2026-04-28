import express from "express";
import { register, login, setupDemo, forgotPassword, resetPassword } from "../controllers/auth.controller.ts";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setup-demo", setupDemo);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
