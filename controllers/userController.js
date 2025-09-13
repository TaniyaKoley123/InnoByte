import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import ErrorResponse from "../utils/errorResponse.js";

// @desc   Register a new user
// @route  POST /api/users/register
// @access Public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return next(new ErrorResponse("All fields are required", 400));
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse("User already exists", 400));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error); // Pass to global error handler
  }
};

// @desc   Get all users
// @route  GET /api/users
// @access Admin only (later add middleware)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");

    res.json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

export { registerUser, getAllUsers };
