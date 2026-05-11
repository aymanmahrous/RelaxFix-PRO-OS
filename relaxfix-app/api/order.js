import telegram from "./telegram.js"; 
import whatsapp from "./whatsapp.js"; 

export default async function (req, res) {
    try {
        const orderData = req.body;

        // إرسال الإشعارات
        await telegram(orderData);
        await whatsapp(orderData);

        // إرجاع استجابة ناجحة
        res.status(200).json({ 
            success: true, 
            message: "Order processed and notifications sent!" 
        });

    } catch (error) {
        // طباعة الخطأ في الـ Logs لمساعدتك في التتبع
        console.error("Error in Order API:", error);
        
        res.status(500).json({ 
            success: false, 
            error: "Internal Server Error",
            details: error.message 
        });
    }
}
