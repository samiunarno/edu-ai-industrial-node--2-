import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      console.error("CRITICAL ERROR: MONGODB_URI environment variable is not defined.");
      console.error("Please configure a real MongoDB database connection string in your environment.");
      console.error("Database operations will fail until configured.");
      return;
    }

    await mongoose.connect(uri);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    console.error("Database operations will fail until connection is restored.");
  }
}

// Schemas
const userSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "teacher" },
  isActive: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

const studentSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  course: { type: String },
  marks: { type: Number },
  teacherId: { type: String, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const feedbackSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  studentId: { type: String, ref: "Student" },
  course: { type: String },
  content: { type: String, required: true },
  generatedByModel: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const aiModelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  version: { type: String },
  apiDetails: { type: String },
  accuracy: { type: Number, default: 0 },
  lastTrained: { type: Date },
  isActive: { type: Number, default: 0 },
  trainingHistory: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const activityLogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  userId: { type: String, ref: "User" },
  action: { type: String, required: true },
  details: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Models
export const User = mongoose.model("User", userSchema);
export const Student = mongoose.model("Student", studentSchema);
export const Feedback = mongoose.model("Feedback", feedbackSchema);
export const AIModel = mongoose.model("AIModel", aiModelSchema);
export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);

// Default export if we need compatible behavior, but we will mostly export models
export default {
  connectDB,
  User,
  Student,
  Feedback,
  AIModel,
  ActivityLog,
};
