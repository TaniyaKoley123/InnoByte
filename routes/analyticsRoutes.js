import express from "express";
import { protect, admin } from "../middleware/auth.js";
import {
  getTaskStatusOverview,
  getTaskDistribution,
  getTaskCompletionTrends,
  getUserActivityLogs,
} from "../controllers/analyticsController.js";

const router = express.Router();

// Only admins can access analytics
router.get("/status-overview", protect, admin, getTaskStatusOverview);
router.get("/distribution", protect, admin, getTaskDistribution);
router.get("/completion-trends", protect, admin, getTaskCompletionTrends);
router.get("/activity-logs", protect, admin, getUserActivityLogs);

export default router;
