import telegram from "./telegram.js"; // تم تعديل المسار لنقطة واحدة
import whatsapp from "./whatsapp.js"; // تم تعديل المسار لنقطة واحدة

export default async function (req, res) {
    try {
        const orderData = req.body;
        console.log("Receiving new order:", orderData);

        // إرسال الإشعارات
        if (telegram) await telegram(orderData);
        // if (whatsapp) await whatsapp(orderData); // فك التعليق إذا كان مفعلًا

        res.status(200).json({ 
            success: true, 
            message: "Order processed successfully" 
        });
    } catch (error) {
        console.error("Order API Error:", error);
        res.status(500).json({ 
            success: false, 
            error: "Failed to process order" 
        });
    }
}
