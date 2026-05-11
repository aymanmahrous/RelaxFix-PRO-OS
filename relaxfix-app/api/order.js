import { supabase } from "../supabase.js";
import sendTelegram from "../telegram.js";
import sendWhatsApp from "../whatsapp.js";

export default async function order(req, res) {
  try {
    const { name, phone, service, details } = req.body;

    if (!name || !phone || !service || !details) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([{ name, phone, service, details, status: "new" }]);

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Database error" });
    }

    const msg =
      `📦 طلب جديد\n\n` +
      `👤 الاسم: ${name}\n` +
      `📞 الهاتف: ${phone}\n` +
      `🛠 الخدمة: ${service}\n` +
      `📝 التفاصيل: ${details}`;

    await sendTelegram(msg);
    await sendWhatsApp(msg);

    res.json({ success: true, message: "Order created successfully" });
  } catch (err) {
    console.error("Order API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
