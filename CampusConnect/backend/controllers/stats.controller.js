const Complaint = require("../models/Complaint");
const User = require("../models/User");

exports.overview = async (req, res) => {
  const isPriv = req.user.role === "admin" || req.user.role === "faculty";
  const match = isPriv ? {} : { createdBy: req.user._id };

  const [byStatus, byCategory, byPriority, totalUsers, totalComplaints, recent] = await Promise.all([
    Complaint.aggregate([{ $match: match }, { $group: { _id: "$status", count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $match: match }, { $group: { _id: "$category", count: { $sum: 1 } } }]),
    Complaint.aggregate([{ $match: match }, { $group: { _id: "$priority", count: { $sum: 1 } } }]),
    isPriv ? User.countDocuments() : 0,
    Complaint.countDocuments(match),
    Complaint.find(match)
      .sort("-createdAt")
      .limit(5)
      .populate("createdBy", "name avatarColor"),
  ]);

  // last 14 days trend
  const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const trend = await Complaint.aggregate([
    { $match: { ...match, createdAt: { $gte: since } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  res.json({
    totals: {
      complaints: totalComplaints,
      users: totalUsers,
    },
    byStatus,
    byCategory,
    byPriority,
    trend,
    recent,
  });
};
