import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --- استيراد ذكي لملف order.js لتجنب خطأ المسارات تماماً ---
let orderRouter;

// 1. التحقق أولاً إذا كان الملف في المجلد الرئيسي مباشرة (وهو الأرجح حالياً)
if (fs.existsSync(path.join(__dirname, "order.js"))) {
    const module = await import("./order.js");
    orderRouter = module.default || module;
    console.log("-> [SUCCESS] Loaded order.js from Root directory");
} 
// 2. التحقق كخيار احتياطي إذا كان داخل مجلد api
else if (fs.existsSync(path.join(__dirname, "api", "order.js"))) {
    const module = await import("./api/order.js");
    orderRouter = module.default || module;
    console.log("-> [SUCCESS] Loaded order.js from api directory");
} else {
    console.error("-> [CRITICAL ERROR] order.js file could not be found in Root or API folder!");
}

// ربط المسارات بالـ Express في حال تم العثور على الملف بنجاح
if (orderRouter) {
    app.use('/api', orderRouter);
}
// -----------------------------------------------------------

const PORT = process.env.PORT || 3000; 

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running successfully on port ${PORT}`);
});

// إعدادات التوقيت لضمان استقرار اتصالات الـ Webhooks ومنع قطعها في Render
server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;
