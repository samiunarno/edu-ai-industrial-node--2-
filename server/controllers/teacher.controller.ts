import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { Student, Feedback, AIModel } from "../db.ts";
import { generateFeedback } from "../services/ai.service.ts";
import { logActivity } from "../services/logger.service.ts";
import { parse } from "csv-parse/sync";

export const getDashboard = async (req: any, res: Response) => {
  try {
    const students = await Student.find({ teacherId: req.user.id });
    
    // Fetch feedbacks and populate studentId
    const feedbacks = await Feedback.find()
      .populate('studentId', 'id name marks')
      .sort({ createdAt: -1 });

    res.json({ students, feedbacks });
  } catch (error) {
    console.error("Dashboard load error:", error);
    res.status(500).json({ error: "Failed to load dashboard data" });
  }
};

export const uploadStudents = async (req: any, res: Response) => {
  try {
    if (req.file) {
      const fileContent = req.file.buffer.toString('utf-8');
      const records = parse(fileContent, { columns: true, skip_empty_lines: true });
      
      const teacherId = req.user.id;
      const activeModel = await AIModel.findOne().sort({ createdAt: -1 });
      
      for (const record of records as any[]) {
        const studentId = uuidv4();
        const name = record.name || "Unknown";
        const course = record.course || "General";
        const marks = parseFloat(record.marks) || 0;

        const newStudent = await Student.create({
          id: studentId,
          name,
          course,
          marks,
          teacherId
        });
        
        // Generate AI Insight
        const insight = await generateFeedback({ course, marks });
        await Feedback.create({
          id: uuidv4(),
          studentId: newStudent.id,
          course,
          content: insight,
          generatedByModel: activeModel ? activeModel.id : undefined
        });
      }
      
      await logActivity(req.user.id, "Uploaded Student Data via CSV", { count: records.length });
    } else {
      await logActivity(req.user.id, "Triggered Manual Sync");
    }

    res.json({ message: "Student data processed" });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to process uploaded data" });
  }
};
