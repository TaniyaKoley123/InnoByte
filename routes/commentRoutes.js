import express from "express";
import { protect } from "../middleware/auth.js";
import { addComment, getComments, deleteComment } from "../controllers/commentController.js";

const router = express.Router();

// ✅ Add and get comments for a task
router.route("/:taskId")
  .post(protect, addComment)
  .get(protect, getComments);

// ✅ Delete a comment
router.route("/delete/:id")
  .delete(protect, deleteComment);

export default router;
