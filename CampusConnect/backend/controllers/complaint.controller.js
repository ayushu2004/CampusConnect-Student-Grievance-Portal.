const Complaint = require("../models/Complaint");
const User = require("../models/User");

const isPrivileged = (role) => role === "admin" || role === "faculty";

exports.create = async (req, res) => {
  const { title, description, category, priority, anonymous } = req.body;
  const complaint = await Complaint.create({
    title,
    description,
    category,
    priority: priority || "Medium",
    anonymous: !!anonymous,
    createdBy: req.user._id,
  });
  res.status(201).json({ complaint });
};

exports.list = async (req, res) => {
  const {
    status,
    category,
    priority,
    q,
    mine,
    page = 1,
    limit = 12,
    sort = "-createdAt",
  } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (priority) filter.priority = priority;
  if (q) filter.$text = { $search: q };

  // Students see only their own; admin/faculty see all (unless mine=1)
  if (!isPrivileged(req.user.role) || mine === "1") {
    filter.createdBy = req.user._id;
  }

  const pg = Math.max(parseInt(page, 10), 1);
  const lim = Math.min(Math.max(parseInt(limit, 10), 1), 50);

  const [items, total] = await Promise.all([
    Complaint.find(filter)
      .sort(sort)
      .skip((pg - 1) * lim)
      .limit(lim)
      .populate("createdBy", "name email avatarColor role")
      .populate("assignedTo", "name email role"),
    Complaint.countDocuments(filter),
  ]);

  // Hide createdBy for anonymous complaints from non-privileged viewers
  const shaped = items.map((c) => {
    const obj = c.toObject();
    if (obj.anonymous && !isPrivileged(req.user.role)) obj.createdBy = null;
    return obj;
  });

  res.json({ items: shaped, total, page: pg, pages: Math.ceil(total / lim) });
};

exports.getOne = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate("createdBy", "name email avatarColor role")
    .populate("assignedTo", "name email role")
    .populate("responses.author", "name email role avatarColor");
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });

  const owner = complaint.createdBy?._id?.toString() === req.user._id.toString();
  if (!owner && !isPrivileged(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  res.json({ complaint });
};

exports.updateStatus = async (req, res) => {
  const { status, priority, assignedTo } = req.body;
  const update = {};
  if (status) update.status = status;
  if (priority) update.priority = priority;
  if (assignedTo !== undefined) update.assignedTo = assignedTo || null;

  const complaint = await Complaint.findByIdAndUpdate(req.params.id, update, {
    new: true,
    runValidators: true,
  });
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  res.json({ complaint });
};

exports.addResponse = async (req, res) => {
  const { message } = req.body;
  if (!message?.trim()) return res.status(400).json({ message: "Message required" });

  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });

  const owner = complaint.createdBy.toString() === req.user._id.toString();
  if (!owner && !isPrivileged(req.user.role)) {
    return res.status(403).json({ message: "Forbidden" });
  }

  complaint.responses.push({
    author: req.user._id,
    authorRole: req.user.role,
    message: message.trim(),
  });
  await complaint.save();
  await complaint.populate("responses.author", "name email role avatarColor");
  res.status(201).json({ complaint });
};

exports.toggleUpvote = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });

  const idx = complaint.upvotes.findIndex((u) => u.toString() === req.user._id.toString());
  if (idx >= 0) complaint.upvotes.splice(idx, 1);
  else complaint.upvotes.push(req.user._id);

  await complaint.save();
  res.json({ upvotes: complaint.upvotes.length, upvoted: idx < 0 });
};

exports.remove = async (req, res) => {
  const complaint = await Complaint.findById(req.params.id);
  if (!complaint) return res.status(404).json({ message: "Complaint not found" });
  const owner = complaint.createdBy.toString() === req.user._id.toString();
  if (!owner && req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden" });
  }
  await complaint.deleteOne();
  res.json({ message: "Deleted" });
};
