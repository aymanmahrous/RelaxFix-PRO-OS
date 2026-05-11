// استيراد الملفات من نفس المجلد (api) باستخدام المسار الصحيح ./
import telegram from "./telegram.js"; 
import whatsapp from "./whatsapp.js"; 

/**
 * دالة معالجة الطلبات (Order Handler)
 * ملاحظة: تأكد أن ملف server.js يقوم باستيراد هذه الدالة واستخدامها في مسار POST
 */
export default async function (req, res) {
    // طباعة البيانات المستلمة للتأكد منها في سجلات Render
    console.log("Received new order request:", req.body);

    try {
        const orderData = req.body;

        // 1. التحقق من وجود بيانات
        if (!orderData || Object.keys(orderData).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No order data provided"
            });
        }

        // 2. إرسال إشعار تليجرام (يتم استدعاء الدالة المستوردة من ./telegram.js)
        try {
            await telegram(orderData);
            console.log("Telegram notification sent successfully");
        } catch (teleErr) {
            console.error("Failed to send Telegram notification:", teleErr.message);
            // لا نوقف العملية كاملة إذا فشل التليجرام فقط
        }

        // 3. إرسال إشعار واتساب (اختياري)
        try {
            await whatsapp(orderData);
            console.log("WhatsApp notification sent successfully");
        } catch (waErr) {
            console.error("Failed to send WhatsApp notification:", waErr.message);
        }

        // 4. إرسال رد النجاح النهائي للمتصفح
        return res.status(200).json({
            success: true,
            message: "🚀 RelaxFix PRO: Order processed and notifications sent!",
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        // في حال حدوث خطأ كارثي في السيرفر
        console.error("Critical Error in Order API:", error);
        return res.status(500).json({
            success: false,
            error: "Internal Server Error",
            details: error.message
        });
    }
}
