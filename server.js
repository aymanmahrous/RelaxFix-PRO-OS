import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import order from "./relaxfix-app/api/order.js";
import webhookHandler from "./api/webhookHandler.js"; // الخدمة الجديدة

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "relaxfix-app")));

// المسارات الحالية والمدمجة
app.post("/api/order", order);
app.post("/api/stripe-webhook", webhookHandler); // ربط نظام الدفع

// مسار رصيد العملات (Credits)
app.get("/api/wallet/balance", async (req, res) => {
    // كود جلب الرصيد من Supabase
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Relax Fix Studio is Live on port ${PORT}`);
});
