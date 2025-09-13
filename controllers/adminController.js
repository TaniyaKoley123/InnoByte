import Task from "../models/taskModel.js";
import User from "../models/userModel.js";

// ✅ Delete any task (admin only)
export const adminDeleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: "Task deleted by admin",
    });
  } catch (error) {
    next(error); // pass to global error handler
  }
};

// ✅ Get all users with their task counts
export const getUsersWithTaskCounts = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    const results = await Promise.all(
      users.map(async (user) => {
        const taskCount = await Task.countDocuments({ assignedTo: user._id });
        return { ...user.toObject(), taskCount };
      })
    );

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};
