import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// الحل: التأكد من المسار الصحيح للملفات المحلية
// بما أن الملفات داخل مجلد api، نستخدم المسار النسبي المباشر
import order from "./api/order.js";
import webhookHandler from "./api/webhookHandler.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// إعدادات قراءة البيانات والملفات الثابتة
app.use(express.json());
// تأكد أن المجلد المرفوع لـ GitHub يحتوي على الملفات مباشرة أو عدل المسار هنا
app.use(express.static(path.join(__dirname, "public"))); 

// المسارات (Routes)
app.post("/api/order", order);
app.post("/api/stripe-webhook", webhookHandler);

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Relax Fix Studio is Live on port ${PORT}`);
});
