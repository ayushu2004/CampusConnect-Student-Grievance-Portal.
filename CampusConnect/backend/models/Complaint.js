const mongoose = require("mongoose");
const { nanoid } = require("nanoid");

const responseSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    authorRole: { type: String, enum: ["student", "admin", "faculty"], required: true },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

const complaintSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      unique: true,
      index: true,
      default: () => "CC-" + nanoid(8).toUpperCase(),
    },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    description: { type: String, required: true, trim: true, maxlength: 4000 },
    category: {
      type: String,
      enum: [
        "Academic",
        "Hostel",
        "Infrastructure",
        "Faculty",
        "Administration",
        "Ragging",
        "Library",
        "Transport",
        "Other",
      ],
      required: true,
      index: true,
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Urgent"],
      default: "Medium",
      index: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Rejected"],
      default: "Open",
      index: true,
    },
    anonymous: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    responses: [responseSchema],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

complaintSchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Complaint", complaintSchema);
