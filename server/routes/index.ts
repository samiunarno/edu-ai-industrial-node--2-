import express from "express";
import authRoutes from "./auth.routes.ts";
import userRoutes from "./user.routes.ts";
import adminRoutes from "./admin.routes.ts";
import teacherRoutes from "./teacher.routes.ts";
import trainerRoutes from "./trainer.routes.ts";
import aiRoutes from "./ai.routes.ts";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/teacher", teacherRoutes);
router.use("/trainer", trainerRoutes);
router.use("/ai", aiRoutes);

export default router;
