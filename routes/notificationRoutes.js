import express from "express";
import { protect } from "../middleware/auth.js";
import { getNotifications, markAsRead, deleteNotification } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/", protect, getNotifications);
router.patch("/:id/read", protect, markAsRead);
router.delete("/:id", protect, deleteNotification);

export default router;
