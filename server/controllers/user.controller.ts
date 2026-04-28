import { Request, Response } from "express";
import { User } from "../db.ts";
import bcrypt from "bcryptjs";
import { logActivity } from "../services/logger.service.ts";

export const getProfile = async (req: any, res: Response) => {
  try {
    const user = await User.findOne({ id: req.user.id }, "id name email role createdAt");
    if (!user) return res.status(404).json({ error: "User not found" });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const { name, password } = req.body;
    
    const targetUser = await User.findOne({ id: req.user.id });
    if (!targetUser) return res.status(404).json({ error: "User not found" });

    if (name) {
      targetUser.name = name;
    }
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      targetUser.password = hashedPassword;
    }

    await targetUser.save();

    const updatedUser = await User.findOne({ id: req.user.id }, "id name email role createdAt");

    await logActivity(req.user.id, "Profile Updated");
    
    res.json(updatedUser);
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
