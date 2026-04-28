import express from "express";
import { getAllUsers, updateUserRole, deleteUser, getSystemLogs, getModels, addModel, updateModelStatus } from "../controllers/admin.controller.ts";
import { authMiddleware, roleMiddleware } from "../middleware/auth.middleware.ts";

const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware(["admin"]));

router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);
router.get("/logs", getSystemLogs);

// Model routes
router.get("/models", getModels);
router.post("/models", addModel);
router.put("/models/:id/status", updateModelStatus);

export default router;
