import ActivityLog from "../models/activityLogModel.js";

// ✅ Get all activity logs (Admin only)
export const getLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find()
      .populate("user", "name email")
      .populate("task", "title")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error); // forward to global error handler
  }
};
