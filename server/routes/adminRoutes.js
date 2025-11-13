import express from "express";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// 🔐 Middleware to verify admin
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Access denied" });
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// 🔹 Get all users
router.get("/users", verifyAdmin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

// 🔹 Delete user
router.delete("/users/:id", verifyAdmin, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.json({ message: "✅ User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err.message });
  }
});

// 🔹 Update user plan (Admin override)
router.put("/users/:id/plan", verifyAdmin, async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { plan }, { new: true });
    res.json({
      message: "✅ Plan updated",
      user: { id: user._id, name: user.name, email: user.email, plan: user.plan },
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating plan", error: err.message });
  }
});

export default router;
