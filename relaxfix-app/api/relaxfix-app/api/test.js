import { supabase } from "../supabase.js";

export default async function test(req, res) {
  try {
    const { data, error } = await supabase.from("orders").select("*").limit(1);

    if (error) {
      return res.status(500).json({ success: false, error: error.message });
    }

    res.json({ success: true, message: "Supabase connected!", data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}