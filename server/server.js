// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { MercadoPagoConfig, Preference } from "mercadopago";

import authRoutes from "./routes/authRoutes.js";
import bunnyRoutes from "./routes/bunnyRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();
const app = express();

// ------------------------------
// ✅ FIXED CORS (FINAL VERSION)
// ------------------------------
const allowedOrigins = [
  "https://agenciavgd.vercel.app",
  "https://agenciavgd-xy81.vercel.app",
 "https://www.nickboy.com.br",
  "https://agenciavgd-anwr.vercel.app",
  "http://localhost:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

// 🔥 IMPORTANT — FIXES OPTIONS PREFLIGHT ERRORS
app.options("*", cors());

app.use(express.json());

// ------------------------------
// ROUTES
// ------------------------------
app.use("/api/auth", authRoutes);
app.use("/api/images", bunnyRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("API is running successfully 🚀"));

// ------------------------------
// MERCADO PAGO CONFIG
// ------------------------------
const MP_TOKEN = process.env.MP_ACCESS_TOKEN;
if (!MP_TOKEN) {
  console.warn("⚠️ MP_ACCESS_TOKEN not set in .env — Mercado Pago calls will fail.");
}

const client = new MercadoPagoConfig({ accessToken: MP_TOKEN });

// ------------------------------
// CREATE PREFERENCE
// ------------------------------
app.post("/create-preference", async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !plan.name || !plan.price) {
      return res.status(400).json({ error: "Invalid plan data" });
    }

    const body = {
      items: [
        {
          title: plan.name,
          quantity: 1,
          currency_id: "BRL",
          unit_price: parseFloat(plan.price),
        },
      ],
      back_urls: {
        success: "https://himalayastechies.com/payment-success",
        failure: "https://himalayastechies.com/payment-failure",
        pending: "https://himalayastechies.com/payment-pending",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body });

    const prefId = result?.id || result?.body?.id;
    if (!prefId) {
      console.error("No preference id returned from Mercado Pago:", result);
      return res.status(500).json({ error: "No preference id returned from MP" });
    }

    return res.json({ id: prefId });
  } catch (err) {
    console.error("Error creating preference:", err);
    return res.status(500).json({ error: err?.message || "MercadoPago error" });
  }
});

// ------------------------------
// WEBHOOK
// ------------------------------
app.post("/webhook/mercadopago", express.json(), async (req, res) => {
  console.log("MP webhook:", req.body);
  res.status(200).send("ok");
});

// ------------------------------
// MONGO CONNECTION
// ------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// ------------------------------
// START SERVER
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
