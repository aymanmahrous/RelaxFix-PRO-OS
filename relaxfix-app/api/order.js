import telegram from "./telegram.js"; 
import whatsapp from "./whatsapp.js"; 

/**
 * دالة معالجة طلبات الحجز الجديدة
 * تم استخدام export default لأن السيرفر يستوردها باسم 'order'
 */
export default async function (req, res) {
    // التأكد من أن الطلب يحتوي على بيانات (Body)
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ 
            success: false, 
            error: "بيانات الطلب مفقودة أو غير صحيحة" 
        });
    }

    try {
        const orderData = req.body;

        // إرسال الإشعارات بشكل متوازي لتسريع الاستجابة
        // سيقوم السيرفر بإرسال التليجرام والواتساب في نفس الوقت
        await Promise.allSettled([
            telegram(orderData),
            whatsapp(orderData)
        ]);

        // إرسال رد النجاح للعميل
        return res.status(200).json({ 
            success: true, 
            message: "تم استلام طلبك بنجاح، سيتم التواصل معك قريباً." 
        });

    } catch (error) {
        // تسجيل الخطأ في الـ Logs الخاصة بـ Render للمتابعة
        console.error("❌ Error processing order:", error.message);
        
        return res.status(500).json({ 
            success: false, 
            error: "حدث خطأ أثناء معالجة الطلب، يرجى المحاولة لاحقاً." 
        });
    }
}
