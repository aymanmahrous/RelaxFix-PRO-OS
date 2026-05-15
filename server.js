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

// --- حل مشكلة مسار ملف order.js ديناميكياً لتجنب خطأ الحروف الكبيرة والصغيرة ---
let orderRouter;
const apiDirPath = path.join(__dirname, "api");

try {
    // قراءة محتويات مجلد api للبحث عن الملف الفعلي المرفوع
    const files = fs.readdirSync(apiDirPath);
    const targetFile = files.find(f => f.toLowerCase() === "order.js");

    if (targetFile) {
        // استيراد الملف ديناميكياً بناءً على اسمه الحقيقي في المجلد
        const modulePath = `./api/${targetFile}`;
        const importedModule = await import(modulePath);
        orderRouter = importedModule.default || importedModule;
        
        // ربط المسار بالـ Express
        app.use('/api', orderRouter);
        console.log(`[Success] Loaded order module from: ${targetFile}`);
    } else {
        console.error("[Error] Could not find any order.js file in 'api' folder.");
    }
} catch (error) {
    console.error("[Error] Failed to load api directory dynamically:", error.message);
}
// -------------------------------------------------------------------------

const PORT = process.env.PORT || 3000; 

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running successfully on port ${PORT}`);
});

server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;
