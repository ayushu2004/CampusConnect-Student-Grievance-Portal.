const User = require("../models/User");
const {
  signAccess,
  signRefresh,
  verifyRefresh,
  hashToken,
  compareToken,
  refreshCookieOptions,
} = require("../utils/tokens");

const palette = ["#7c3aed", "#0ea5e9", "#f59e0b", "#ef4444", "#10b981", "#ec4899", "#6366f1"];
const pickColor = () => palette[Math.floor(Math.random() * palette.length)];

const issueTokens = async (user) => {
  const access = signAccess({ sub: user._id.toString(), role: user.role });
  const refresh = signRefresh({ sub: user._id.toString(), role: user.role });
  user.refreshTokenHash = await hashToken(refresh);
  await user.save();
  return { access, refresh };
};

exports.register = async (req, res) => {
  const { name, email, password, rollNo, department, role } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({
    name,
    email,
    password,
    rollNo,
    department,
    role: role === "faculty" ? "faculty" : "student", // never allow admin from public route
    avatarColor: pickColor(),
  });

  const { access, refresh } = await issueTokens(user);
  res
    .cookie("cc_rt", refresh, refreshCookieOptions())
    .status(201)
    .json({ user: user.toSafeJSON(), accessToken: access });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await user.matchPassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const { access, refresh } = await issueTokens(user);
  res
    .cookie("cc_rt", refresh, refreshCookieOptions())
    .json({ user: user.toSafeJSON(), accessToken: access });
};

exports.refresh = async (req, res) => {
  const token = req.cookies?.cc_rt;
  if (!token) return res.status(401).json({ message: "No refresh token" });

  let decoded;
  try {
    decoded = verifyRefresh(token);
  } catch {
    return res.status(401).json({ message: "Invalid refresh token" });
  }

  const user = await User.findById(decoded.sub).select("+refreshTokenHash");
  if (!user || !user.refreshTokenHash) {
    return res.status(401).json({ message: "Session expired" });
  }
  const match = await compareToken(token, user.refreshTokenHash);
  if (!match) return res.status(401).json({ message: "Refresh token mismatch" });

  // rotate
  const { access, refresh } = await issueTokens(user);
  res
    .cookie("cc_rt", refresh, refreshCookieOptions())
    .json({ accessToken: access, user: user.toSafeJSON() });
};

exports.logout = async (req, res) => {
  const token = req.cookies?.cc_rt;
  if (token) {
    try {
      const decoded = verifyRefresh(token);
      const user = await User.findById(decoded.sub);
      if (user) {
        user.refreshTokenHash = undefined;
        await user.save();
      }
    } catch (_) {}
  }
  res.clearCookie("cc_rt", { ...refreshCookieOptions(), maxAge: 0 });
  res.json({ message: "Logged out" });
};

exports.me = async (req, res) => {
  res.json({ user: req.user.toSafeJSON() });
};
