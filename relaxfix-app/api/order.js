import telegram from "./telegram.js"; 
import whatsapp from "./whatsapp.js"; 

// تصدير الدالة كدالة افتراضية لمعالج الطلبات
export default async function (req, res) {
    try {
        // استلام البيانات من جسم الطلب
        const orderData = req.body;

        // تنفيذ إرسال الإشعارات (تأكد أن الدوال داخل الملفات الأخرى مهيأة لاستقبال البيانات)
        if (typeof telegram === 'function') {
            await telegram(orderData);
        }
        
        if (typeof whatsapp === 'function') {
            await whatsapp(orderData);
        }

        // إرسال رد النجاح
        res.status(200).json({ 
            success: true, 
            message: "Order processed and notifications sent!" 
        });

    } catch (error) {
        console.error("Error in Order API:", error);
        res.status(500).json({ 
            success: false, 
            error: "Internal Server Error",
            details: error.message 
        });
    }
}
