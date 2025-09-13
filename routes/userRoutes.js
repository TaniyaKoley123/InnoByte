import express from "express";
import { registerUser, getAllUsers } from "../controllers/userController.js";

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Get all users (admin only later)
router.get("/", getAllUsers);

export default router;
