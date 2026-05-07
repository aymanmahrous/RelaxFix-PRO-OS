import { sendTelegram } from "../telegram.js";
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, phone, service, details } = req.body;

  // 1) حفظ الطلب في Supabase
  const { data, error } = await supabase
    .from("orders")
    .insert([{ name, phone, service, details, status: "new" }]);

  if (error) {
    return res.status(400).json({ success: false, error });
  }

  // 2) إرسال إشعار Telegram
  await sendTelegram(`
طلب جديد:
الاسم: ${name}
الهاتف: ${phone}
الخدمة: ${service}
التفاصيل: ${details}
  `);

  // 3) رد للعميل
  res.json({ success: true });
}
