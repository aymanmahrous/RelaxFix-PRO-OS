import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// استيراد الـ API
import order from "./relaxfix-app/api/order.js";
import orders from "./relaxfix-app/api/orders.js";
import update from "./relaxfix-app/api/update.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.json());

// تشغيل ملفات الواجهة من مجلد relaxfix-app
app.use(express.static(path.join(__dirname, "relaxfix-app")));

// ربط المسارات
app.post("/api/order", order);
app.get("/api/orders", orders);
app.post("/api/update", update);

// إعدادات المنفذ لـ Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 RelaxFix PRO OS is firing up on port ${PORT}`);
    console.log(`🌐 System is live and ready for orders!`);
});
