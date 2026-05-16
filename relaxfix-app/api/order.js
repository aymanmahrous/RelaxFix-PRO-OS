import { createClient } from "@supabase/supabase-js";
import { sendWhatsAppNotification } from "../../services/whatsappservice.js";

// Initialize Supabase client with environment variables
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

// Validation helper
const validateOrderData = (orderData) => {
    const requiredFields = ['userId', 'name', 'phone', 'service'];
    const missingFields = requiredFields.filter(field => !orderData[field]);
    
    if (missingFields.length > 0) {
        return {
            valid: false,
            error: `Missing required fields: ${missingFields.join(', ')}`
        };
    }
    
    // Validate phone number format
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(orderData.phone)) {
        return { valid: false, error: 'Invalid phone number format' };
    }
    
    return { valid: true };
};

export default async function (req, res) {
    try {
        const orderData = req.body;
        const userId = orderData.userId;

        // Validate input data
        const validation = validateOrderData(orderData);
        if (!validation.valid) {
            return res.status(400).json({ success: false, error: validation.error });
        }

        // 1. Deduct one credit from wallet if available
        try {
            const { data: wallet } = await supabase
                .from('user_wallets')
                .select('balance_credits')
                .eq('user_id', userId)
                .single();

            if (wallet && wallet.balance_credits > 0) {
                await supabase.rpc('decrement_credits', { 
                    user_id_input: userId, 
                    amount: 1 
                });
            }
        } catch (walletError) {
            console.error('Wallet update error:', walletError.message);
            // Continue with order even if wallet update fails
        }

        // 2. Send WhatsApp notification to admin
        try {
            const message = `📋 طلب جديد من ${orderData.name}\n📱 الهاتف: ${orderData.phone}\n🔧 الخدمة: ${orderData.service}\n📝 التفاصيل: ${orderData.details || 'بدون تفاصيل'}`;
            await sendWhatsAppNotification(message);
        } catch (whatsappError) {
            console.error('WhatsApp notification error:', whatsappError.message);
        }

        // 3. Save the order
        const { data, error } = await supabase
            .from("orders")
            .insert([{
                ...orderData,
                created_at: new Date().toISOString(),
                status: 'pending'
            }]);

        if (error) throw error;

        res.status(200).json({ 
            success: true, 
            message: "تم استقبال الطلب بنجاح",
            orderId: data?.[0]?.id
        });
    } catch (error) {
        console.error('Order API Error:', error);
        res.status(500).json({ 
            success: false, 
            error: 'فشل في معالجة الطلب. حاول مرة أخرى' 
        });
    }
}
