// import express from "express";
// import { registerUser, loginUser } from "../controllers/authController.js";
// import { protect } from "../middleware/auth.js";

// const router = express.Router();

// // Register
// router.post("/register", registerUser);

// // Login
// router.post("/login", loginUser);

// // Protected route
// router.get("/me", protect, (req, res) => {
//   res.json(req.user);
// });

// export default router;


import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
//router.get("/profile", protect, getUserProfile);
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});

export default router;