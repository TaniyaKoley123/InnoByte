import ActivityLog from "../models/activityLogModel.js";

export const logActivity = async (userId, action, taskId) => {
  try {
    await ActivityLog.create({
      user: userId,
      action,
      task: taskId,
    });
  } catch (error) {
    console.error("Error logging activity:", error.message);
  }
};
