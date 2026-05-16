import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import routers from "./server/routers.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Initialize order router
const initializeOrderRouter = async () => {
    try {
        let orderRouter;

        // Try loading from relaxfix-app/api directory first
        if (fs.existsSync(path.join(__dirname, "relaxfix-app", "api", "order.js"))) {
            const module = await import("./relaxfix-app/api/order.js");
            orderRouter = module.default;
            console.log("✅ Loaded order.js from relaxfix-app/api directory");
        } 
        // Fallback to root directory
        else if (fs.existsSync(path.join(__dirname, "order.js"))) {
            const module = await import("./order.js");
            orderRouter = module.default;
            console.log("✅ Loaded order.js from root directory");
        } 
        else {
            throw new Error("order.js not found in expected locations");
        }

        return orderRouter;
    } catch (error) {
        console.error("❌ Failed to initialize order router:", error.message);
        return null;
    }
};

// Register routers
const registerRouters = async () => {
    try {
        // Register main routers
        app.use('/api', routers);
        console.log("✅ Registered main API routers");

        // Register order router
        const orderRouter = await initializeOrderRouter();
        if (orderRouter) {
            // Create a wrapper for the order endpoint
            app.post('/api/order', orderRouter);
            console.log("✅ Registered order endpoint");
        }
    } catch (error) {
        console.error("❌ Router registration failed:", error.message);
    }
};

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const startServer = async () => {
    await registerRouters();

    const PORT = process.env.PORT || 3000;

    const server = app.listen(PORT, '0.0.0.0', () => {
        console.log(`\n🚀 Server is running on port ${PORT}`);
        console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`🔐 Secure mode: ${process.env.NODE_ENV === 'production' ? 'ON' : 'OFF'}\n`);
    });

    // Configure timeouts for webhook stability
    server.keepAliveTimeout = 120000;
    server.headersTimeout = 120000;
    server.requestTimeout = 60000;

    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('\n⏹️  SIGTERM received. Shutting down gracefully...');
        server.close(() => {
            console.log('✅ Server closed');
            process.exit(0);
        });
    });
};

startServer().catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
});
