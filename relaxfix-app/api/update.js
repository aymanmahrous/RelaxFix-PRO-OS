import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

const VALID_STATUSES = ['pending', 'in_progress', 'completed', 'cancelled'];

export default async function update(req, res) {
    try {
        const { id, status } = req.body;

        // Validate required fields
        if (!id || !status) {
            return res.status(400).json({ 
                error: "Missing required fields: id and status" 
            });
        }

        // Validate status value
        if (!VALID_STATUSES.includes(status)) {
            return res.status(400).json({ 
                error: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}` 
            });
        }

        // Update order in database
        const { data, error } = await supabase
            .from("orders")
            .update({ 
                status,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .select();

        if (error) {
            console.error("Supabase Error:", error);
            return res.status(500).json({ error: "Database error" });
        }

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        res.json({ 
            success: true, 
            message: "تم تحديث حالة الطلب بنجاح",
            data: data[0]
        });
    } catch (err) {
        console.error("Update API Error:", err);
        res.status(500).json({ error: "Server error" });
    }
}
