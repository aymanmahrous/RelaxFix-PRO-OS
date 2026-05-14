import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

// إعداد المسارات الأساسية
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// تأكد من أن هذا المسار يطابق تماماً اسم المجلدات في GitHub
// إذا كان المجلد يبدأ بحرف كبير، يجب كتابته كبيراً
import orderRoutes from "./relaxfix-app/api/order.js";

// ربط الملفات الثابتة (الموقع نفسه)
app.use(express.static(path.join(__dirname, "relaxfix-app")));

// --- المسارات ---
app.post("/api/order", orderRoutes);

// مسار تجريبي للتأكد من عمل السيرفر
app.get("/health", (req, res) => res.send("Server is Healthy! ✅"));

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 RelaxFix PRO OS is firing up on port ${PORT}`);
    console.log(`🌐 Everything is ready!`);
});
