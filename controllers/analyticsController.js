import Task from "../models/taskModel.js";
import ActivityLog from "../models/activityLogModel.js";

// ✅ Task Status Overview (pending, in-progress, completed)
export const getTaskStatusOverview = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error); // pass to global error handler
  }
};

// ✅ Task Distribution by User
export const getTaskDistribution = async (req, res, next) => {
  try {
    const stats = await Task.aggregate([
      { $group: { _id: "$assignedTo", count: { $sum: 1 } } },
    ]);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Completed Tasks Over Time (last 30 days)
export const getTaskCompletionTrends = async (req, res, next) => {
  try {
    const today = new Date();
    const past30 = new Date(today);
    past30.setDate(today.getDate() - 30);

    const stats = await Task.aggregate([
      { $match: { status: "completed", updatedAt: { $gte: past30 } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ User Activity Logs (latest actions by users)
export const getUserActivityLogs = async (req, res, next) => {
  try {
    const logs = await ActivityLog.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

