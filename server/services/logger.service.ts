import { ActivityLog } from "../db.ts";
import { v4 as uuidv4 } from "uuid";

export const logActivity = async (userId: string | null, action: string, details?: any) => {
  try {
    await ActivityLog.create({
      id: uuidv4(),
      userId: userId || undefined,
      action,
      details: details ? JSON.stringify(details) : undefined
    });
  } catch (err) {
    console.error("Failed to log activity", err);
  }
};
