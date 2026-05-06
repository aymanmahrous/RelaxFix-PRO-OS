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
