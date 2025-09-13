import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Total tasks
    const totalTasks = await Task.countDocuments();

    // 2. Tasks by status
    const tasksByStatus = await Task.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    // 3. Tasks due today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tasksDueToday = await Task.countDocuments({
      dueDate: { $gte: today, $lt: tomorrow }
    });

    // 4. Users with most assigned tasks (top 5)
    const usersWithMostTasks = await Task.aggregate([
      { $match: { assignedTo: { $ne: null } } },
      { $group: { _id: "$assignedTo", taskCount: { $sum: 1 } } },
      { $sort: { taskCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          userId: "$user._id",
          name: "$user.name",
          email: "$user.email",
          taskCount: 1
        }
      }
    ]);

    res.json({
      success: true,
      totalTasks,
      tasksByStatus,
      tasksDueToday,
      topUsers: usersWithMostTasks
    });
  } catch (error) {
    next(error); // ✅ Forward to global error handler
  }
};
