// 1. استيراد المكتبات الأساسية
import express from 'express';
import stripe from 'stripe';
// 2. تصحيح استيراد الملف المحلي (تأكد من إضافة .js في النهاية)
// هذا هو الحل المباشر للخطأ في الصور السابقة
import { handleWebhook } from './api/webhookHandler.js'; 

const app = express();
const port = process.env.PORT || 10000; // المنفذ الافتراضي لـ Render

// إعدادات الخادم لرفع كفاءة الاتصال كما في image_6.png
app.use(express.json());

// مسار افتراضي للتأكد من عمل الخادم
app.get('/', (req, res) => {
  res.send('الخادم يعمل بنجاح!');
});

// تشغيل الخادم
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on port ${port}`);
});

// حل مشكلة التوقف المفاجئ (Timeouts) المذكورة في image_6.png
server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;
 