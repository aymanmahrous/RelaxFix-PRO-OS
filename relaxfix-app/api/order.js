import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" })
    }

    const { name, phone, service, details } = req.body

    const { data, error } = await supabase
        .from("orders")
        .insert([{ name, phone, service, details }])

    if (error) return res.status(400).json({ success: false, error })

    res.json({ success: true })
}
