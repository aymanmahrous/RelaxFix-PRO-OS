// 1. استيراد المكتبات الأساسية اللازمة لتشغيل الخادم والتعامل مع المسارات
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// إعداد المسارات للعمل مع ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. استيراد ملفات المنطق البرمجي (الطلبات والـ Webhooks)
// ملاحظة: الامتداد .js ضروري جداً هنا لأنك تستخدم "type": "module"
import order from "./api/order.js";

const app = express();

// إعدادات Middleware الأساسية
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // تأكد من وجود مجلد public إذا كان لديك ملفات ثابتة

// استخدام المسارات المستوردة
app.use('/api', order);

// منفذ التشغيل (Port) - Render يستخدم غالباً المتغير PORT تلقائياً
const PORT = process.env.PORT || 3000; 

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

// ضبط وقت الاستجابة لضمان عدم انقطاع الاتصال في Render
// تم ضبط الوقت على 120 ثانية (120000 مللي ثانية)
server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;
