import express from "express";
import { createClient } from "@supabase/supabase-js";
const router = express.Router();
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// مسار تسجيل فني جديد (Recruitment) من وثيقة التعارف
router.post("/technicians/apply", async (req, res) => {
    const { data, error } = await supabase
        .from('technician_profiles')
        .insert([req.body]);

    if (error) return res.status(500).json({ error: error.message });
    res.json({ success: true, message: "تم حفظ بيانات المرشح بنجاح" });
});

// مسار الحصول على رصيد العملات
router.get("/user/balance", async (req, res) => {
    const { userId } = req.query;
    const { data } = await supabase.from('user_wallets').select('balance_credits').eq('user_id', userId).single();
    res.json({ balance: data?.balance_credits || 0 });
});

export default router;
