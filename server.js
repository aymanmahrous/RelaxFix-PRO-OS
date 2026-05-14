// 1. استيراد المكتبات الأساسية اللازمة لتشغيل الخادم والتعامل مع المسارات
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

// 2. استيراد ملفات المنطق البرمجي (الطلبات والـ Webhooks)
// ملاحظة: الامتداد .js ضروري جداً هنا لأنك تستخدم "type": "module"
import order from "./api/order.js";

const app = express();
const PORT = process.env.PORT || 3000; 

// إعدادات الخادم الأساسية هنا...

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

// تم ضبط الوقت على 120 ثانية (120000 مللي ثانية)
server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;
