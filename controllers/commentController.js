import Comment from "../models/commentModel.js";
import { logActivity } from "../middleware/activityLogger.js";

// ✅ Add Comment
export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Comment text is required",
        code: 400,
      });
    }

    const comment = await Comment.create({
      task: req.params.taskId,
      user: req.user._id,
      text,
    });

    await logActivity(req.user._id, `Commented on task: ${req.params.taskId}`);

    res.status(201).json({
      success: true,
      comment,
    });
  } catch (error) {
    next(error); // ✅ forward error to global handler
  }
};

// ✅ Get Comments for Task
export const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ task: req.params.taskId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      comments,
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Delete Comment
export const deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
        code: 404,
      });
    }

    // only author or admin can delete
    if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
        code: 403,
      });
    }

    await comment.deleteOne();
    await logActivity(req.user._id, `Deleted a comment on task: ${comment.task}`);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
