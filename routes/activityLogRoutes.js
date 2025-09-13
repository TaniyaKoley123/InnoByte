import express from "express";
import { protect } from "../middleware/auth.js";
import { admin } from "../middleware/auth.js";
import { getLogs } from "../controllers/activityLogController.js";

const router = express.Router();

router.get("/", protect, admin, getLogs);

export default router;
