import express from "express";
import { createClient } from "@supabase/supabase-js";

const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// 1. مسار جلب رصيد العملات
router.get("/wallet", async (req, res) => {
    const { userId } = req.query;
    const { data, error } = await supabase.from('user_wallets').select('*').eq('user_id', userId).single();
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

// 2. مسار تقديم طلب انضمام فني (Recruitment)
router.post("/apply", async (req, res) => {
    const { data, error } = await supabase.from('technician_profiles').insert([req.body]);
    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, message: "تم تسجيل طلبك بنجاح" });
});

export default router;
