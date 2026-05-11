import telegram from "./telegram.js"; 
import whatsapp from "./whatsapp.js"; 

export default async function (req, res) {
    try {
        const orderData = req.body;

        // إرسال الإشعارات
        await telegram(orderData);
        await whatsapp(orderData);

        res.status(200).json({ success: true, message: "تم استلام الطلب بنجاح" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, error: error.message });
    }
}
