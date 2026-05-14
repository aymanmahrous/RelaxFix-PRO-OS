// 1. استيراد المكتبات الأساسية اللازمة لتشغيل الخادم والتعامل مع المسارات
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// 2. استيراد ملفات المنطق البرمجي (الطلبات والـ Webhooks)
// ملاحظة: الامتداد .js ضروري جداً هنا
import order from "./api/order.js"; 
import webhookHandler from "./api/webhookHandler.js";

// 3. إعداد متغيرات المسارات للوصول للملفات داخل نظام التشغيل
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 4. إعدادات الوسيط (Middleware)
// تمكين الخادم من فهم البيانات بصيغة JSON القادمة من Stripe أو التطبيق
app.use(express.json());

// تشغيل الملفات الثابتة (مثل index.html و style.css) من المجلد الرئيسي
app.use(express.static(__dirname)); 

// 5. تعريف المسارات (Routes) لربط الروابط بالوظائف البرمجية
app.post("/api/order", order); // مسار معالجة الطلبات الجديدة
app.post("/api/stripe-webhook", webhookHandler); // مسار استقبال تأكيدات الدفع من Stripe

// 6. تشغيل الخادم على المنفذ المخصص من قبل منصة Render
const PORT = process.env.PORT || 10000;
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Relax Fix Studio is Live on port ${PORT}`);
});

// 7. حل مشكلة التوقف المفاجئ (Timeouts) لضمان استقرار الخدمة
// تم ضبط الوقت على 120 ثانية (120000 مللي ثانية)
server.keepAliveTimeout = 120000; 
server.headersTimeout = 120000;
 