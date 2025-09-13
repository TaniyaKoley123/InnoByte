// export const getHealth = (req, res) => {
//   res.status(200).json({
//     status: "OK",
//     uptime: process.uptime(),        // server uptime in seconds
//     timestamp: new Date().toISOString(),
//   });
// };

import user from "../models/userModel.js";

export const getHealth = async (req, res) => {
  try {
    const healthData = {
      status: "OK",
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };

    // Save to MongoDB Atlas
    const log = new user(healthData);
    await log.save();

    // Send back response
    res.status(200).json(healthData);
  } catch (err) {
    console.error("Error saving health log:", err);
    res.status(500).json({ status: "Error",message:err.message});
  }
}

//NEW CODE
// import User from "../models/User.js";

// // Register new user
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Validation
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     // Check duplicate email
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: "Email already registered" });
//     }

//     // Create user
//     const user = new User({ name, email, password });
//     await user.save();

//     res.status(201).json(user); // password excluded by toJSON()
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// // Get all users (admin only)
// export const getAllUsers = async (req, res) => {
//   try {
//     // ✅ In real app, check req.user.isAdmin from auth middleware
//     if (!req.query.admin || req.query.admin !== "true") {
//       return res.status(403).json({ message: "Access denied. Admins only." });
//     }

//     const users = await User.find();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
