import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import order from "./relaxfix-app/api/order.js";
import webhookHandler from "./api/webhookHandler.js";
import routers from "./server/routers.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// هام: Stripe يحتاج الوصول لبيانات الـ raw body في مسار الـ Webhook
app.use("/api/webhook", express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "relaxfix-app")));

// ربط المسارات
app.use("/api/v1", routers);
app.post("/api/order", order);
app.post("/api/webhook", webhookHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 RelaxFix PRO OS is live on port ${PORT}`);
});
