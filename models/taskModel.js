import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
     status: { type: String, default: "pending", index: true }, 
    dueDate: { type: Date, index: true }, 
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    attachments: [
      {
        fileName: String,
        filePath: String,
        fileType: String,
      },
    ],
  },
  { timestamps: true }
);

taskSchema.index({ status: 1, dueDate: 1 });

const Task = mongoose.model("Task", taskSchema);
export default Task;


