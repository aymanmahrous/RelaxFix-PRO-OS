import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// استيراد الـ API (التي حُذفت بالخطأ)
import order from "./relaxfix-app/api/order.js";
import orders from "./relaxfix-app/api/orders.js";
import update from "./relaxfix-app/api/update.js";

// إنشاء السيرفر
const app = express();
app.use(express.json());

// حل مشكلة المسارات في ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تشغيل ملفات الواجهة (Frontend)
app.use(express.static(path.join(__dirname, "relaxfix-app")));

// ربط الـ API (المسارات الحيوية للموقع)
app.post("/api/order", order);
app.get("/api/orders", orders);
app.post("/api/update", update);

// --- التعديل الجديد لعام 2026 ---
// تعريف المنفذ (Port) مرة واحدة فقط
const PORT = process.env.PORT || 3000;

// تشغيل السيرفر النهائي لـ RelaxFix PRO OS
app.listen(PORT, () => {
    console.log(`🚀 RelaxFix PRO OS is firing up on port ${PORT}`);
    console.log(`🌐 System is live at: http://localhost:${PORT}`);
    console.log(`🛠️ All APIs (Order, Orders, Update) are connected!`);
});

