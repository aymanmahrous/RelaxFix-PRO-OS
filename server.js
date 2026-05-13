import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import order from "./relaxfix-app/api/order.js";
import orders from "./relaxfix-app/api/orders.js";
import update from "./relaxfix-app/api/update.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعدادات السيرفر
app.use(express.json());
app.use(express.static(path.join(__dirname, "relaxfix-app")));

// ربط المسارات الحيوية (API)
app.post("/api/order", order);
app.get("/api/orders", orders);
app.post("/api/update", update);

// إعدادات Render لعام 2026
const PORT = process.env.PORT || 10000;
const HOST = '0.0.0.0';

app.listen(PORT, HOST, () => {
    console.log(`🚀 RelaxFix PRO OS is firing up on port ${PORT}`);
    console.log(`🌐 System is live and ready for orders!`);
});
