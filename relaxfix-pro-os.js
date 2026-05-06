/* ============================================================
   RELAXFIX PRO OS — PART 1/4
   BASE SERVER + SUPABASE + AI + ORDERS SYSTEM
============================================================ */

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

/* ============================================================
   SUPABASE CONFIG
============================================================ */
const SUPABASE_URL = "YOUR_URL";
const SUPABASE_KEY = "YOUR_KEY";

const db = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ============================================================
   API — CREATE ORDER
============================================================ */
app.post("/api/order", async (req, res) => {
    const { name, phone, service, details } = req.body;

    const { data, error } = await db
        .from("orders")
        .insert([{ name, phone, service, details, status: "pending" }]);

    if (error) return res.json({ error });

    res.json({ success: true, order: data });
});

/* ============================================================
   API — GET ALL ORDERS
============================================================ */
app.get("/api/orders", async (req, res) => {
    const { data } = await db
        .from("orders")
        .select("*")
        .order("id", { ascending: false });

    res.json(data);
});

/* ============================================================
   AI ASSISTANT
============================================================ */
app.post("/api/ai", async (req, res) => {
    const { message, lang } = req.body;

    const reply = `تم استلام سؤالك: ${message}`;

    res.json({ reply });
});
/* ============================================================
   RELAXFIX PRO OS — PART 3/4
   DASHBOARD + ANALYTICS + SYSTEM LOGS
============================================================ */

/* ============================================================
   API — SYSTEM STATS
============================================================ */
app.get("/api/stats", async (req, res) => {
    const orders = await db.from("orders").select("*");
    const technicians = await db.from("technicians").select("*");

    res.json({
        total_orders: orders.data?.length || 0,
        total_technicians: technicians.data?.length || 0,
        pending_orders: orders.data?.filter(o => o.status === "pending").length || 0,
        assigned_orders: orders.data?.filter(o => o.status === "assigned").length || 0,
        completed_orders: orders.data?.filter(o => o.status === "completed").length || 0
    });
});

/* ============================================================
   API — SYSTEM LOGS
============================================================ */
app.post("/api/log", async (req, res) => {
    const { message } = req.body;

    console.log("SYSTEM LOG:", message);

    res.json({ success: true });
});

/* ============================================================
   API — DELETE ORDER
============================================================ */
app.post("/api/order/delete", async (req, res) => {
    const { id } = req.body;

    const { error } = await db
        .from("orders")
        .delete()
        .eq("id", id);

    if (error) return res.json({ error });

    res.json({ success: true });
});

/* ============================================================
   API — COMPLETE ORDER
============================================================ */
app.post("/api/order/complete", async (req, res) => {
    const { id } = req.body;

    const { error } = await db
        .from("orders")
        .update({ status: "completed" })
        .eq("id", id);

    if (error) return res.json({ error });

    res.json({ success: true });
});
/* ============================================================
   RELAXFIX PRO OS — PART 4/4
   SERVER START + DEFAULT ROUTES + HEALTH CHECK
============================================================ */

/* ============================================================
   HOME ROUTE
============================================================ */
app.get("/", (req, res) => {
    res.send("RelaxFix PRO OS is running successfully.");
});

/* ============================================================
   HEALTH CHECK
============================================================ */
app.get("/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
});

/* ============================================================
   START SERVER
============================================================ */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`RelaxFix PRO OS running on port ${PORT}`);
});

