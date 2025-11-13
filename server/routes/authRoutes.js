import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

const router = express.Router();
dotenv.config();

/**
 * 🔹 SIGNUP (supports admin creation)
 */
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // ✅ include role in request

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "⚠️ User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      plan: "free",
      role: role || "user", // ✅ allow admin creation if role is sent
    });

    res.status(201).json({
      message: "✅ User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
});

/**
 * 🔹 LOGIN (supports admin bypass login)
 */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Hardcoded admin account check
    if (email === "admin@site.com" && password === process.env.ADMIN_PASS) {
      const token = jwt.sign(
        { email, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        message: "✅ Admin login successful",
        token,
        user: { email, role: "admin" },
      });
    }

    // ✅ Normal user login
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "⚠️ User not found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "❌ Invalid password" });

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role, plan: user.plan },
      process.env.JWT_SECRET || "defaultSecretKey",
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "✅ Login successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res
      .status(500)
      .json({ message: "Error logging in", error: error.message });
  }
});

/**
 * 🔹 UPDATE PLAN
 */
router.put("/update-plan", async (req, res) => {
  try {
    const { userId, plan } = req.body;

    if (!userId || !plan)
      return res.status(400).json({ message: "User ID and plan are required" });

    const user = await User.findByIdAndUpdate(
      userId,
      { plan },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    console.log("✅ Plan updated:", user.plan);
    res.status(200).json({
      message: "Plan updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("❌ Update plan error:", error.message);
    res.status(500).json({ message: "Error updating plan", error: error.message });
  }
});

/**
 * 🔹 FORGOT PASSWORD
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "⚠️ Usuário não encontrado" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
    const resetLink = `${FRONTEND_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"HNYCLB Suporte" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Redefinição de Senha",
      html: `
        <h2>Olá ${user.name || "Usuário"},</h2>
        <p>Você solicitou a redefinição da sua senha.</p>
        <p>Clique no botão abaixo para redefinir sua senha:</p>
        <a href="${resetLink}" style="
          background:#ff007f;
          color:white;
          padding:10px 20px;
          border-radius:8px;
          text-decoration:none;">Redefinir Senha</a>
        <p>Esse link expira em 10 minutos.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "📩 Link de redefinição enviado ao seu e-mail!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});

/**
 * 🔹 RESET PASSWORD
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token inválido ou expirado" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;
    await user.save();

    res.json({ message: "✅ Senha redefinida com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro no servidor" });
  }
});
/**
 * 🔹 UPDATE USER PROFILE
 */
router.put("/update-user/:id", async (req, res) => {
  try {
    const { name, email } = req.body;
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.status(200).json({
      message: "✅ Perfil atualizado com sucesso!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error.message);
    res.status(500).json({ message: "Erro no servidor", error: error.message });
  }
});


export default router;
