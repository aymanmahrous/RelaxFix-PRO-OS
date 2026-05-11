import { supabase } from "../supabase.js";

export default async function orders(req, res) {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Supabase Error:", error);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(data);
  } catch (err) {
    console.error("Orders API Error:", err);
    res.status(500).json({ error: "Server error" });
  }
}
