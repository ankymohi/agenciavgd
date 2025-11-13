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
app.use(cors());
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/images", bunnyRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => res.send("API is running successfully 🚀"));

// Mercado Pago v2 client
const MP_TOKEN = process.env.MP_ACCESS_TOKEN;
if (!MP_TOKEN) {
  console.warn("⚠️ MP_ACCESS_TOKEN not set in .env — Mercado Pago calls will fail.");
}
const client = new MercadoPagoConfig({ accessToken: MP_TOKEN });

// create preference endpoint
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
    pending: "hhttps://himalayastechies.com/payment-pending"
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
app.post("/webhook/mercadopago", express.json(), async (req, res) => {
  // log the payload
  console.log("MP webhook:", req.body);
  // verify event type & then update DB when payment approved
  // Example payload processing depends on Mercado Pago webhook body
  res.status(200).send("ok");
});

/*
  Optional webhook endpoint (recommended, see step 5)
  app.post('/webhook/mercadopago', express.json(), (req, res) => { ... })
*/

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
