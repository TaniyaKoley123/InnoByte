// // import express from "express";
// // import dotenv from "dotenv";
// // import mongoose from "mongoose";
// // import connectDB from "./config/db.js";
// // import logger from "./middleware/logger.js";
// // import healthRoutes from "./routes/healthRoutes.js";
// // import userRoutes from "./routes/userRoutes.js";
// // import authRoutes from "./routes/authRoutes.js";

// // dotenv.config();
// // const app = express();

// // // Connect DB
// // connectDB();

// // // Middleware
// // app.use(express.json());
// // app.use(logger);
// // //app.use(express.json());

// // // Routes
// // app.use("/api/health", healthRoutes);
// // app.use("/api/users", userRoutes);
// // app.use("/api/auth", authRoutes);

// // mongoose.connect("mongodb://localhost:27017/yourDB")
// //   .then(() => console.log("MongoDB connected"))
// //   .catch(err => console.error(err));

// // const PORT = process.env.PORT || 5000;
// // app.listen(PORT, () => {
// //   console.log(`🚀 Server running on port ${PORT}`);
// // });

// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import authRoutes from "./routes/authRoutes.js";

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);

// // Connect DB & Start Server
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("MongoDB Connected");
//     app.listen(5000, () => console.log("Server running on port 5000"));
//   })
//   .catch((err) => console.error(err));

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import path from "path";
import { fileURLToPath } from "url";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import activityLogRoutes from "./routes/activityLogRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import { swaggerUi, swaggerSpec } from "./swagger.js";
import cors from "cors";

dotenv.config();

const app = express();
const server = createServer(app);

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// Connect DB & Start Server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));

  // __dirname fix for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static folder for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/admin", adminRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/logs", activityLogRoutes);

app.use("/api/comments", commentRoutes);

app.use("/api/analytics", analyticsRoutes);


// ✅ Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*", // change to frontend URL if needed
    methods: ["GET", "POST"],
  },
});

// ✅ Store active users
let onlineUsers = {};

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  // When user joins
  socket.on("register", (userId) => {
    onlineUsers[userId] = socket.id;
    console.log("🟢 Registered:", userId);
  });

  // When user disconnects
  socket.on("disconnect", () => {
    for (let userId in onlineUsers) {
      if (onlineUsers[userId] === socket.id) {
        delete onlineUsers[userId];
        console.log("🔴 Disconnected:", userId);
      }
    }
  });
});

// ✅ Export io and onlineUsers
export { io, onlineUsers };

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Swagger route
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
export default app;

app.use(cors({
  origin: ["http://localhost:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));