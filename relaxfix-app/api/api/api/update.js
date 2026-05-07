import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default async function handler(req, res) {
    const { id, status } = req.body

    const { error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id)

    if (error) return res.status(400).json({ error })

    res.json({ success: true })
}
