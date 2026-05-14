import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import orderRoutes from "./relaxfix-app/api/order.js";
import webhookHandler from "./webhooks/webhookHandler.js";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// إعدادات البيئة
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname, "relaxfix-app")));

// --- المسارات المدمجة ---
app.post("/api/order", orderRoutes);
app.post("/api/webhooks/stripe", webhookHandler); // مسار Stripe الجديد

// مسار تسجيل الفنيين (Recruitment) المستوحى من وثائقك
app.post("/api/technicians/apply", async (req, res) => {
    const { data, error } = await supabase.from('technician_profiles').insert([req.body]);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, message: "Application Received" });
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 RelaxFix PRO OS Live on Port ${PORT}`);
});
