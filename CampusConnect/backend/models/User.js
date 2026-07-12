const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["student", "admin", "faculty"],
      default: "student",
      index: true,
    },
    rollNo: { type: String, trim: true, uppercase: true },
    department: { type: String, trim: true },
    avatarColor: { type: String, default: "#7c3aed" },
    refreshTokenHash: { type: String, select: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.methods.toSafeJSON = function () {
  const { _id, name, email, role, rollNo, department, avatarColor, createdAt } = this;
  return { id: _id, name, email, role, rollNo, department, avatarColor, createdAt };
};

module.exports = mongoose.model("User", userSchema);
