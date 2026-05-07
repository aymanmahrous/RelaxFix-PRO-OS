const TOKEN = process.env.TELEGRAM_TOKEN
const CHAT_ID = process.env.TELEGRAM_CHAT_ID

export async function sendTelegram(msg) {
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage`

    await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: msg
        })
    })
}
