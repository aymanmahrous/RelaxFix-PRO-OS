// 1. استيراد المكتبات الأساسية
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// 2. استيراد الملفات البرمجية من مجلد api
// ملاحظة: تأكد من إضافة .js في نهاية المسار لأنك تستخدم "type": "module"
import order from "./api/order.js"; 
import webhookHandler from "./api/webhookHandler.js";

// 3. إعداد مسارات المجلدات للتعامل مع الملفات الثابتة (مثل الصور و CSS)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 4. إعدادات الوسيط (Middleware) لتمكين قراءة البيانات القادمة من Stripe وطلبات المستخدمين
app.use(express.json());

// تشغيل الملفات الثابتة (واجهة المستخدم) من المجلد الرئيسي
app.use(express.static(__dirname)); 

// 5. تعريف المسارات (Routes) لربط الطلبات بالملفات المناسبة
app.post("/api/order", order);
app.post("/api/stripe-webhook", webhookHandler);

// 6. تشغيل الخادم على المنفذ الذي تحدده منصة Render
const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Relax Fix Studio is Live on port ${PORT}`);
});

// 7. حل مشكلة التوقف المفاجئ (Timeouts) كما هو موضح في image_6.png و image_18.png
server.keepAliveTimeout = 120000; // 120 ثانية
server.headersTimeout = 120000;   // 120 ثانية
