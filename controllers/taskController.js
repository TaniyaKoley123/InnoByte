import mongoose from "mongoose";
import Task from "../models/taskModel.js";
import Notification from "../models/notificationModel.js";
import { logActivity } from "../middleware/activityLogger.js";


// ✅ Create Task
export const createTask = async (req, res, next) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;

    const task = await Task.create({
      title,
      description,
      dueDate,
      assignedTo,
      createdBy: req.user._id,
    });

    // 🔔 Notify assigned user
    if (assignedTo) {
      await Notification.create({
        user: assignedTo,
        message: `You have been assigned a new task: ${title}`,
      });
    }

    await logActivity(req.user._id, `Created task: ${title}`);

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get All Tasks (with filters + pagination)
export const getTasks = async (req, res, next) => {
  try {
    const { status, dueDate, title, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (dueDate) filter.dueDate = { $lte: new Date(dueDate) };
    if (title) filter.title = { $regex: title, $options: "i" };

    const skip = (page - 1) * limit;

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      message: "Tasks fetched successfully",
      data: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
        tasks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get Task by ID
export const getTaskById = async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return next(new ErrorResponse("Invalid Task ID", 400));
    }

    const task = await Task.findById(req.params.id)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    if (!task) return next(new ErrorResponse("Task not found", 404));

    res.json({
      success: true,
      message: "Task fetched successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Update Task
export const updateTask = async (req, res, next) => {
  try {
    const task = req.task; // from middleware
    const { title, description, status, dueDate, assignedTo } = req.body;

    const oldAssignedTo = task.assignedTo?.toString();

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (assignedTo !== undefined) task.assignedTo = assignedTo;

    await task.save();

    if (assignedTo && assignedTo.toString() !== oldAssignedTo) {
      await Notification.create({
        user: assignedTo,
        message: `You have been reassigned a task: ${task.title}`,
      });
    }

    await logActivity(req.user._id, `Updated task: ${task.title}`);

    res.json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete Task
export const deleteTask = async (req, res, next) => {
  try {
    const task = req.task;

    if (task.createdBy.toString() !== req.user._id.toString()) {
      return next(new ErrorResponse("Only creator can delete this task", 403));
    }

    await task.deleteOne();

    await logActivity(req.user._id, `Deleted task: ${task.title}`);

    res.json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Upload File
export const uploadFile = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new ErrorResponse("Task not found", 404));

    task.attachments.push({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
    });

    await task.save();
    await logActivity(req.user._id, `Uploaded file to task: ${task.title}`);

    res.json({
      success: true,
      message: "File uploaded successfully",
      data: task.attachments,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get My Tasks
export const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("createdBy", "name email")
      .populate("assignedTo", "name email");

    res.json({
      success: true,
      message: "My tasks fetched successfully",
      data: tasks,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Mark Task In Progress
export const markTaskInProgress = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new ErrorResponse("Task not found", 404));

    if (task.status !== "pending") {
      return next(new ErrorResponse("Only pending tasks can move to in-progress", 400));
    }

    task.status = "in-progress";
    await task.save();
    await logActivity(req.user._id, `Marked task in-progress: ${task.title}`);

    res.json({
      success: true,
      message: "Task marked as in-progress",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Mark Task Completed
export const markTaskComplete = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return next(new ErrorResponse("Task not found", 404));

    if (task.status === "completed") {
      return next(new ErrorResponse("Task already completed", 400));
    }

    if (task.status !== "in-progress") {
      return next(new ErrorResponse("Only in-progress tasks can be completed", 400));
    }

    task.status = "completed";
    await task.save();
    await logActivity(req.user._id, `Marked task completed: ${task.title}`);

    res.json({
      success: true,
      message: "Task marked as completed",
      data: task,
    });
  } catch (error) {
    next(error);
  }
};
