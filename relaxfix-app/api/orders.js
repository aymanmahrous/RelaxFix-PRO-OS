import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

export default async function (req, res) {
    try {
        // Fetch all orders from database
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        res.status(200).json({ 
            success: true, 
            data: data || [] 
        });
    } catch (error) {
        console.error("Orders API Error:", error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}
