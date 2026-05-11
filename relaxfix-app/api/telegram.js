// relaxfix-app/api/telegram.js

export default async function telegram(orderData) {
    const token = "7724131238:AAEm_S_H_T68B_mS7XNclTqE6_H71-nU5mY"; // التوكن الخاص بك
    const chatId = "6616428780"; // ايدي الشات الخاص بك
    const message = `طلب جديد:\n${JSON.stringify(orderData, null, 2)}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text: message })
        });
        return await response.json();
    } catch (error) {
        console.error("Telegram Error:", error);
    }
}
