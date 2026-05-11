import telegram from "./telegram.js"; 
import whatsapp from "./whatsapp.js"; 

// دالة معالجة الطلبات
export default async function (req, res) {
    try {
        // استقبال بيانات الطلب من المتصفح
        const orderData = req.body;

        // 1. إرسال البيانات إلى تليجرام
        if (telegram) {
            await telegram(orderData);
        }

        // 2. إرسال البيانات إلى واتساب (اختياري)
        if (whatsapp) {
            await whatsapp(orderData);
        }

        // إرسال رد نجاح للواجهة الأمامية
        res.status(200).json({ 
            success: true, 
            message: "تم استلام الطلب وإرسال الإشعارات بنجاح" 
        });

    } catch (error) {
        // في حال حدوث أي خطأ، يتم طباعته في سجلات Render
        console.error("خطأ في ملف order.js:", error);
        res.status(500).json({ 
            success: false, 
            error: "فشل في معالجة الطلب" 
        });
    }
}
