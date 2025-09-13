import express from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getMyTasks,
  uploadFile, 
  markTaskInProgress,
  markTaskComplete,  // ✅ new controller
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";
import { isOwnerOrAssigned } from "../middleware/taskMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // ✅ multer middleware

const router = express.Router();

// ✅ Create Task
router.post("/", protect, createTask);

// ✅ Get All Tasks (with filters/search/pagination)
router.get("/", protect, getTasks);

// ✅ Get My Tasks (tasks assigned to logged-in user)
router.get("/my-tasks", protect, getMyTasks);

// ✅ Get Task by ID
router.get("/:id", protect, getTaskById);

// ✅ Update Task (only owner or assigned user)
router.put("/:id", protect, isOwnerOrAssigned, updateTask);

// ✅ Delete Task (only owner can delete, handled inside controller/middleware)
router.delete("/:id", protect, isOwnerOrAssigned, deleteTask);

// ✅ Upload File to Task (jpg, png, pdf, max 2MB)
router.post("/:id/upload", protect, upload.single("file"), uploadFile);

router.patch("/:id/in-progress", protect, isOwnerOrAssigned, markTaskInProgress);
router.patch("/:id/complete", protect, isOwnerOrAssigned, markTaskComplete);
export default router;

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/", protect, getTasks);

/**
 * @swagger
 * /tasks/{id}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task object
 *       404:
 *         description: Task not found
 */
router.get("/:id", protect, getTaskById);


