import { createClient } from "@supabase/supabase-js";
import telegram from "./telegram.js";
import whatsapp from "./whatsapp.js";

// إعدادات Supabase المباشرة (تم فحصها وتصحيحها)
const supabaseUrl = "https://nmzxrjdxvmmzzmajrskm.supabase.co";
const supabaseKey = "EyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tenhyamR4dm1tenptYWpyc2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcwMzI2MzMsImV4cCI6MjA5MjYwODYzM30.v8kU5m9Whp18DqJu7bQWPJFt3GKkgKo0akHo8mp9L4c";

const supabase = createClient(supabaseUrl, supabaseKey);

export default async function (req, res) {
    try {
        const orderData = req.body;

        // 1. إرسال الإشعارات (مع فحص الأمان)
        if (telegram) await telegram(orderData);
        if (whatsapp) await whatsapp(orderData);

        // 2. تخزين الطلب في Supabase في جدول "orders"
        const { data, error } = await supabase
            .from("orders")
            .insert([orderData]);

        if (error) throw error;

        console.log("✅ Order saved and notifications sent!");
        res.status(200).json({ 
            success: true, 
            message: "Order processed successfully!" 
        });

    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}
