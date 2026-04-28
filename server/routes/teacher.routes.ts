import express from "express";
import { getDashboard, uploadStudents } from "../controllers/teacher.controller.ts";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware.ts";
import { uploadMiddleware } from "../middleware/upload.middleware.ts";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(["admin", "teacher"]));

router.get("/dashboard", getDashboard);
router.post("/students", uploadMiddleware.single("file"), uploadStudents);

export default router;
