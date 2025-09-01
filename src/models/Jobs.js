import mongoose from "mongoose";

const jobsSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Projects",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  officer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["new", "in progress", "review", "rejected", "completed"],
    default: "new",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  workingSpaceUrl: {
    type: String,
  },
  workingSpaceDescription: {
    type: String,
  },
  comment: {
    type: String,
  }
}, {timestamps: true});

const Jobs = mongoose.model("Jobs", jobsSchema)
export default Jobs
