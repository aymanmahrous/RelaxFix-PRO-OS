import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req, res) {
    const event = req.body;

    try {
        // عند نجاح عملية الدفع
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.client_reference_id;
            const amount = session.amount_total / 100;

            // 1. إضافة الفاتورة
            await supabase.from('invoices').insert([{ 
                user_id: userId, amount: amount, status: 'paid' 
            }]);

            // 2. تحديث الرصيد (كل 1 درهم = 10 عملات)
            const creditsToAdd = Math.floor(amount * 10);
            const { data: wallet } = await supabase.from('user_wallets').select('balance_credits').eq('user_id', userId).single();
            await supabase.from('user_wallets').update({ 
                balance_credits: (wallet?.balance_credits || 0) + creditsToAdd 
            }).eq('user_id', userId);

            // 3. إشعار تليجرام
            await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
                chat_id: process.env.TELEGRAM_CHAT_ID,
                text: `💰 دفع ناجح!\nالمبلغ: ${amount} AED\nتم إضافة ${creditsToAdd} عملة للمستخدم: ${userId}`
            });
        }
        res.json({ success: true });
    } catch (err) {
        res.status(400).send(`Error: ${err.message}`);
    }
}
