// middleware/taskMiddleware.js
import Task from "../models/taskModel.js";

export const isOwnerOrAssigned = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // allow only creator or assigned user
    if (
      task.createdBy.toString() !== req.user._id.toString() &&
      (!task.assignedTo || task.assignedTo.toString() !== req.user._id.toString())
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    req.task = task; // save task for next handler
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
