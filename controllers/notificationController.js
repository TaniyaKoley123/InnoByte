import Notification from "../models/notificationModel.js";
import { io, onlineUsers } from "../app.js";
import Task from "../models/taskModel.js"; // ✅ needed for createTask

// ✅ Get notifications for logged-in user
export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    next(error); // ✅ Pass to global error handler
  }
};

// ✅ Mark notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
        code: 404,
      });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
        code: 403,
      });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete a notification
export const deleteNotification = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
        code: 404,
      });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
        code: 403,
      });
    }

    await notification.deleteOne();
    res.json({ success: true, message: "Notification deleted" });
  } catch (error) {
    next(error);
  }
};

// Helper: send real-time notification
const sendNotification = (userId, message) => {
  if (onlineUsers[userId]) {
    io.to(onlineUsers[userId]).emit("notification", message);
  }
};

// ✅ Example: Create Task (with notification)
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

    // Save + send notification
    if (assignedTo) {
      const notification = await Notification.create({
        user: assignedTo,
        message: `📌 You have been assigned a new task: ${title}`,
      });

      // 🔔 Send real-time notification
      sendNotification(assignedTo.toString(), notification);
    }

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};
