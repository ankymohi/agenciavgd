import express from "express";
import { getImagesByPlan } from "../controllers/bunnyController.js";

const router = express.Router();

router.get("/:plan", getImagesByPlan);

export default router;
