import axios from "axios";

const WHATSAPP_ADMIN = process.env.WHATSAPP_ADMIN || "+971588259848";
const WHATSAPP_API_KEY = process.env.WHATSAPP_API_KEY;
const WHATSAPP_API_URL = process.env.WHATSAPP_API_URL || "https://api.whatsapp.com";

export const sendWhatsAppNotification = async (message) => {
    try {
        // Generate direct link (works without API key)
        const encodedMsg = encodeURIComponent(message);
        const link = `https://wa.me/${WHATSAPP_ADMIN.replace('+', '')}?text=${encodedMsg}`;
        
        console.log("🔗 WhatsApp Alert Link Generated:", link);
        
        // If you have WhatsApp Business API credentials, use this:
        // if (WHATSAPP_API_KEY) {
        //     const response = await axios.post(`${WHATSAPP_API_URL}/messages`, {
        //         messaging_product: "whatsapp",
        //         to: WHATSAPP_ADMIN,
        //         type: "text",
        //         text: { body: message }
        //     }, {
        //         headers: {
        //             "Authorization": `Bearer ${WHATSAPP_API_KEY}`,
        //             "Content-Type": "application/json"
        //         }
        //     });
        //     return response.data;
        // }
        
        return { success: true, link };
    } catch (error) {
        console.error("❌ WhatsApp Service Error:", error.message);
        return { success: false, error: error.message };
    }
};
