import express from "express";
import { protect, admin } from "../middleware/auth.js";
import { adminDeleteTask, getUsersWithTaskCounts } from "../controllers/adminController.js";

const router = express.Router();

// Admin can delete any task
router.delete("/tasks/:id", protect, admin, adminDeleteTask);

// Get all users with their task counts
router.get("/users/task-counts", protect, admin, getUsersWithTaskCounts);

export default router;
