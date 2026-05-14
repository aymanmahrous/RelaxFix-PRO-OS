import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
    const sig = req.headers['stripe-signature'];
    const event = req.body; // في الإنتاج استخدم rawBody للتحقق من التوقيع

    try {
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.client_reference_id;
            const amount = session.amount_total / 100;

            // 1. تحديث حالة الفاتورة في Supabase
            await supabase
                .from('invoices')
                .insert([{ user_id: userId, amount: amount, status: 'paid', stripe_payment_id: session.id }]);

            // 2. تحديث رصيد العملات (Credits) للمستخدم
            // لنفترض أن كل دولار يعطي 10 عملات
            const creditsToAdd = Math.floor(amount * 10);
            await supabase.rpc('increment_wallet_balance', { user_id_input: userId, credits: creditsToAdd });

            // 3. إرسال إشعار تليجرام
            const message = `💰 تم استلام دفع جديد!\nالعميل: ${userId}\nالمبلغ: ${amount} AED\nالعملات المضافة: ${creditsToAdd}`;
            await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: message
            });
        }
        res.json({ received: true });
    } catch (err) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
}
