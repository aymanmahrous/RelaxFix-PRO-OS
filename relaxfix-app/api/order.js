import telegram from "./telegram.js";
import whatsapp from "./whatsapp.js";

/**
 * دالة معالجة الطلبات - تُصدر كدالة افتراضية
 * ليتعرف عليها ملف server.js
 */
export default async function (req, res) {
    try {
        // استلام البيانات من الطلب (Body)
        const orderData = req.body;

        // التحقق من وجود بيانات
        if (!orderData || Object.keys(orderData).length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "No data received" 
            });
        }

        // 1. إرسال إشعار التليجرام
        await telegram(orderData);

        // 2. إرسال إشعار الواتساب
        await whatsapp(orderData);

        // 3. الرد بالنجاح
        console.log("✅ Order processed successfully");
        res.status(200).json({ 
            success: true, 
            message: "Order placed and notifications sent!" 
        });

    } catch (error) {
        // في حال حدوث أي خطأ، نطبعه في سجلات Render ونرسل استجابة بالخطأ
        console.error("❌ API Error:", error.message);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}
 