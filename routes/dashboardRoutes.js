import express from "express";
import { protect, admin } from "../middleware/auth.js";
import { getDashboardStats } from "../controllers/dashboardController.js";

const router = express.Router();

// Only admin can access dashboard stats
router.get("/stats", protect, admin, getDashboardStats);

export default router;
