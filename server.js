import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

// حل مشكلة المسارات في ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// تشغيل ملفات الواجهة من relaxfix-app
app.use(express.static(path.join(__dirname, "relaxfix-app")));

// تشغيل API
import order from "./relaxfix-app/api/order.js";
import orders from "./relaxfix-app/api/orders.js";
import update from "./relaxfix-app/api/update.js";

app.post("/api/order", order);
app.get("/api/orders", orders);
app.post("/api/update", update);

// تشغيل السيرفر
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🚀 Server running on port", PORT);
});
