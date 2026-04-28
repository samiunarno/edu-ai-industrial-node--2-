import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { User, AIModel, Student } from "../db.ts";
import { logActivity } from "../services/logger.service.ts";
import { sendEmail } from "../services/email.service.ts";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_xyz123";

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body;
    let userRole = role || 'teacher';
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = uuidv4();
    
    await User.create({
      id: userId,
      name,
      email,
      password: hashedPassword,
      role: userRole
    });

    await logActivity(userId, "User Registered", { role: userRole });
    
    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to the EdTech Platform',
        html: `<h3>Hello ${name},</h3><p>Your account has been created successfully with the role: <strong>${userRole}</strong>.</p><p>You can now log in and access your dashboard.</p>`
      });
    } catch (e) {
      console.error("Email notification failed for registration:", e);
    }

    res.status(201).json({ message: "User registered" });
  } catch (error: any) {
    console.error("Registration error:", error);
    res.status(400).json({ error: "Registration failed", details: error.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '1d' });
    await logActivity(user.id, "User Login");
    
    res.json({ token, role: user.role, name: user.name });
  } catch (error: any) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

export const setupDemo = async (req: Request, res: Response) => {
  try {
    let admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const adminId = uuidv4();
      admin = await User.create({
        id: adminId,
        email: 'admin@system.com',
        name: 'Super Admin',
        password: hashedPassword,
        role: 'admin'
      });
    }
    
    // Seed AI Model if none exists
    const modelCount = await AIModel.countDocuments();
    if (modelCount === 0) {
      await AIModel.create({
        id: uuidv4(),
        name: 'Gemini Pro EDU',
        version: '1.5-flash',
        apiDetails: 'Standard Google GenAI',
        isActive: 1,
        accuracy: 94.5
      });
    }
    
    // Seed some data linked to this admin
    const studentCount = await Student.countDocuments();
    if (studentCount === 0) {
      const demoStudents = [
        { name: 'John Doe', course: 'Math 101', marks: 85, teacherId: admin.id },
        { name: 'Jane Smith', course: 'Physics 202', marks: 92, teacherId: admin.id },
        { name: 'Ahmed Khan', course: 'Chemistry 101', marks: 76, teacherId: admin.id }
      ];
      
      for (const s of demoStudents) {
        await Student.create({
          id: uuidv4(),
          ...s
        });
      }
    }
    
    res.json({ message: "Demo data setup completed. You can login with admin@system.com / admin123" });
  } catch(error: any) {
    console.error("Setup error:", error);
    res.status(500).json({ error: "Setup failed" });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    
    if (user) {
      const resetToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '15m' });
      const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
      
      try {
        await sendEmail({
          to: email,
          subject: 'Password Reset Request',
          html: `<h3>Hello ${user.name},</h3><p>You requested a password reset. Please click the link below to securely reset your credentials:</p><p><a href="${resetUrl}">Reset Password</a></p><p>This link will expire in 15 minutes.</p>`
        });
        await logActivity(user.id, "Password Reset Email Sent");
      } catch (e) {
        console.error("Failed to send reset email:", e);
      }
    }
    
    res.json({ message: "If that explicit email exists, a reset link has been dispatched." });
  } catch (error) {
    res.status(500).json({ error: "Failed to process request" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    const user = await User.findOne({ id: decoded.id });
    if (!user) return res.status(404).json({ error: "Invalid token or user not found" });
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Successfully Changed',
        html: `<h3>Hello ${user.name},</h3><p>Your EdTech Platform password has been successfully altered. If you did not make this change, please contact an administrator immediately.</p>`
      });
      await logActivity(user.id, "Password Successfully Reset via Token");
    } catch (e) {
      console.error("Failed to send success email:", e);
    }
    
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(400).json({ error: "Invalid or expired token" });
  }
};
