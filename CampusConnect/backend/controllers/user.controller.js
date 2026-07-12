const User = require("../models/User");

exports.list = async (req, res) => {
  const { role, q, page = 1, limit = 20 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (q) filter.$or = [{ name: new RegExp(q, "i") }, { email: new RegExp(q, "i") }];

  const pg = Math.max(parseInt(page, 10), 1);
  const lim = Math.min(Math.max(parseInt(limit, 10), 1), 100);

  const [items, total] = await Promise.all([
    User.find(filter).sort("-createdAt").skip((pg - 1) * lim).limit(lim),
    User.countDocuments(filter),
  ]);
  res.json({
    items: items.map((u) => u.toSafeJSON()),
    total,
    page: pg,
    pages: Math.ceil(total / lim),
  });
};

exports.updateRole = async (req, res) => {
  const { role } = req.body;
  if (!["student", "admin", "faculty"].includes(role))
    return res.status(400).json({ message: "Invalid role" });
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user: user.toSafeJSON() });
};

exports.remove = async (req, res) => {
  if (req.user._id.toString() === req.params.id)
    return res.status(400).json({ message: "You cannot delete yourself" });
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ message: "Deleted" });
};

exports.updateMe = async (req, res) => {
  const { name, department, rollNo, avatarColor } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, department, rollNo, avatarColor },
    { new: true, runValidators: true }
  );
  res.json({ user: user.toSafeJSON() });
};
