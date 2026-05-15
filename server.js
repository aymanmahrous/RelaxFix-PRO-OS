import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// حل ذكي لقراءة ملف order.js من الهاتف وتفادي خطأ الحروف تماماً
let orderRouter;
const apiDirPath = path.join(__dirname, "api");

try {
    const files = fs.readdirSync(apiDirPath);
    const targetFile = files.find(f => f.toLowerCase() === "order.js");

    if (targetFile) {
        const modulePath = `./api/${targetFile}`;
        const importedModule = await import(modulePath);
        orderRouter = importedModule.default || importedModule;
        
        app.use('/api', orderRouter);
        console.log(`[Success] Loaded order module: ${targetFile}`);
    } else {
        console.error("[Error] order.js not found in api folder.");
    }
} catch (error) {
    console.error("[Error] Dynamic import failed:", error.message);
}

const PORT = process.env.PORT || 3000; 

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

server.keepAliveTimeout = 120000;
server.headersTimeout = 120000;
