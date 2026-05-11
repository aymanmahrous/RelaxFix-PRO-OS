import telegram from "./telegram.js"; 
import whatsapp from "./whatsapp.js"; 

export default async function (req, res) {
    // التأكد من أن الطلب من نوع POST
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const orderData = req.body;

        // تنفيذ إرسال التليجرام
        // ملاحظة: تأكد أن ملف telegram.js يصدر دالة (Function)
        if (typeof telegram === 'function') {
            await telegram(orderData);
        } else {
            console.error("Telegram module is not a function");
        }

        // تنفيذ إرسال الواتساب
        if (typeof whatsapp === 'function') {
            await whatsapp(orderData);
        }

        // إرسال رد النجاح
        res.status(200).json({ 
            success: true, 
            message: "تم استلام الطلب بنجاح وإرسال الإشعارات" 
        });

    } catch (error) {
        console.error("Error in Order API:", error);
        res.status(500).json({ 
            success: false, 
            error: "فشل في معالجة الطلب",
            details: error.message 
        });
    }
}
