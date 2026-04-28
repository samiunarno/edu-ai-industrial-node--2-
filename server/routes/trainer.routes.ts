import express from "express";
import { getDashboard, loadModelData, evaluateModelOutput } from "../controllers/trainer.controller.ts";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(["admin", "ai_trainer"]));

router.get("/dashboard", getDashboard);
router.post("/train", loadModelData);
router.post("/evaluate", evaluateModelOutput);

export default router;
