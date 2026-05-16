import { createClient } from "@supabase/supabase-js";
import axios from "axios";

const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_ANON_KEY
);

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Verify webhook signature (implement based on your payment processor)
const verifyWebhookSignature = (req) => {
    // TODO: Implement signature verification
    // This is crucial for security
    return true;
};

export default async function (req, res) {
    try {
        // Verify webhook authenticity
        if (!verifyWebhookSignature(req)) {
            return res.status(401).json({ error: 'Invalid webhook signature' });
        }

        const event = req.body;

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const userId = session.client_reference_id;

            if (!userId) {
                return res.status(400).json({ error: 'Missing user ID' });
            }

            try {
                // 1. Insert new invoice
                await supabase.from('invoices').insert([{
                    user_id: userId,
                    amount: session.amount_total / 100,
                    status: 'paid',
                    stripe_session_id: session.id,
                    created_at: new Date().toISOString()
                }]);

                // 2. Update credits
                await supabase.rpc('increment_balance', { 
                    user_id_input: userId, 
                    amount: 100 
                });

                // 3. Send Telegram notification
                if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
                    await axios.post(
                        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                        {
                            chat_id: TELEGRAM_CHAT_ID,
                            text: `✅ Payment received from user ${userId}\n💰 Amount: $${session.amount_total / 100}\n📊 New balance: 100 credits`
                        }
                    );
                }

                res.status(200).json({ 
                    success: true, 
                    message: 'Webhook processed successfully' 
                });
            } catch (processError) {
                console.error('Error processing webhook:', processError);
                res.status(500).json({ error: 'Failed to process payment' });
            }
        } else {
            res.status(200).json({ message: 'Webhook received but not processed' });
        }
    } catch (err) {
        console.error('Webhook Error:', err.message);
        res.status(400).json({ error: err.message });
    }
}
