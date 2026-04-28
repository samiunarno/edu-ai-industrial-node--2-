import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { User, ActivityLog, AIModel } from "../db.ts";
import { logActivity } from "../services/logger.service.ts";

export const getAllUsers = async (req: any, res: Response) => {
  try {
    const users = await User.find({}, "id name email role createdAt");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

export const updateUserRole = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["admin", "teacher", "ai_trainer", "banned"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const targetUser = await User.findOne({ id });
    if (!targetUser) {
      return res.status(404).json({ error: "User not found" });
    }

    targetUser.role = role;
    await targetUser.save();

    await logActivity(req.user.id, `Updated role of ${targetUser.email} to ${role}`);

    const users = await User.find({}, "id name email role createdAt");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to update user role" });
  }
};

export const deleteUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const targetUser = await User.findOne({ id });
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    await User.deleteOne({ id });
    await logActivity(req.user.id, `Deleted system user: ${targetUser.email}`);

    const users = await User.find({}, "id name email role createdAt");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user" });
  }
};

export const getSystemLogs = async (req: any, res: Response) => {
  try {
    const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100).populate('userId', 'id name email');
    res.json(logs);
  } catch (error) {
    console.error("Fetch logs error:", error);
    res.status(500).json({ error: "Failed to fetch system logs" });
  }
};

// AI Model Management
export const getModels = async (req: any, res: Response) => {
  try {
    const models = await AIModel.find().sort({ createdAt: -1 });
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch models" });
  }
};

export const addModel = async (req: any, res: Response) => {
  try {
    const { name, version, apiDetails } = req.body;
    const id = uuidv4();
    
    const newModel = await AIModel.create({
      id, name, version, apiDetails, isActive: 0
    });

    await logActivity(req.user.id, `Added new AI model: ${name} (v${version})`);

    res.json(newModel);
  } catch (error) {
    res.status(500).json({ error: "Failed to add model" });
  }
};

export const updateModelStatus = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const targetModel = await AIModel.findOne({ id });
    if (!targetModel) {
      return res.status(404).json({ error: "Model not found" });
    }

    if (isActive) {
      await AIModel.updateMany({}, { isActive: 0 });
    }

    targetModel.isActive = isActive ? 1 : 0;
    await targetModel.save();

    await logActivity(req.user.id, `${isActive ? 'Activated' : 'Deactivated'} AI model: ${targetModel.name}`);

    const models = await AIModel.find().sort({ createdAt: -1 });
    res.json(models);
  } catch (error) {
    res.status(500).json({ error: "Failed to update model status" });
  }
};
