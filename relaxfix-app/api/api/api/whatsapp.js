export async function sendWhatsApp(phone, message) {
    const url = `https://api.ultramsg.com/${process.env.WHATSAPP_INSTANCE}/messages/chat`

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            token: process.env.WHATSAPP_TOKEN,
            to: phone,
            body: message
        })
    })
}
