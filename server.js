import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// --- استيراد الـ API (التي حُدثت في التعديل الأخير) ---
import order from "./relaxfix-app/api/order.js";
import orders from "./relaxfix-app/api/orders.js";
import update from "./relaxfix-app/api/update.js";

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- تشغيل ملفات الواجهة من مجلد relaxfix-app ---
app.use(express.static(path.join(__dirname, "relaxfix-app")));

// --- ربط الـ API المسارات الحيوية ---
app.post("/api/order", order);
app.get("/api/orders", orders);
app.post("/api/update", update);

// --- إعدادات المنفذ (Port) وتدشين السيرفر لعام 2026 ---
// تعريف المنفذ مرة واحدة فقط كما طلبت
const PORT = process.env.PORT || 3000;

// تشغيل السيرفر النهائي لـ RelaxFix PRO OS
app.listen(PORT, () => {
    console.log(`🚀 RelaxFix PRO OS is firing up on port ${PORT}`);
    console.log(`🌐 System is live and ready for orders!`);
    console.log(`📍 Visit: http://localhost:${PORT}`);
});
