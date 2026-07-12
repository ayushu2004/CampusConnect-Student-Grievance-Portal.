const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signAccess = (payload) =>
  jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });

const signRefresh = (payload) =>
  jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "7d",
  });

const verifyAccess = (token) => jwt.verify(token, process.env.JWT_ACCESS_SECRET);
const verifyRefresh = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

const hashToken = (token) => bcrypt.hash(token, 10);
const compareToken = (token, hash) => bcrypt.compare(token, hash);

const refreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/api/auth",
});

module.exports = {
  signAccess,
  signRefresh,
  verifyAccess,
  verifyRefresh,
  hashToken,
  compareToken,
  refreshCookieOptions,
};
