import telegram from "./telegram.js"; 
import whatsapp from "./whatsapp.js"; 

// تأكد أنك قمت بتعريف الـ Client الخاص بـ Supabase هنا إذا كنت تستخدمه
// أو قم باستيراده إذا كان في ملف منفصل

export default async function (req, res) {
    try {
        const orderData = req.body;

        // تنفيذ إرسال التليجرام
        if (telegram) {
            await telegram(orderData);
        }

        // تنفيذ إرسال الواتساب (اختياري)
        if (whatsapp) {
            await whatsapp(orderData);
        }

        // إرسال رد النجاح للمتصفح
        res.status(200).json({ 
            success: true, 
            message: "Order processed and notifications sent!" 
        });

    } catch (error) {
        console.error("Error in Order API:", error);
        res.status(500).json({ 
            success: false, 
            error: "Internal Server Error" 
        });
    }
}

