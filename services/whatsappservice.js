const WHATSAPP_ADMIN = "+971588259848";

export const sendWhatsAppNotification = async (message) => {
    // توليد رابط مباشر للتواصل السريع كما في وثائقك
    const encodedMsg = encodeURIComponent(message);
    const link = `https://wa.me/${WHATSAPP_ADMIN.replace('+', '')}?text=${encodedMsg}`;
    
    console.log("🔗 WhatsApp Alert Generated:", link);
    // إذا كنت تستخدم API مثل Twilio، يتم الربط هنا
    return link;
};
