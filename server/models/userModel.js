// models/userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    plan: { type: String, enum: ["free", "basic", "premium", "vip"], default: "free" },
    resetToken: { type: String },
    resetTokenExpire: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
