import express from "express";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

const router = express.Router();
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_ANON_KEY
);

// Middleware for authentication
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }
    
    // TODO: Verify JWT token
    req.userId = token; // Placeholder
    next();
};

// 1. Get user wallet balance
router.get("/wallet", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.query;
        
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const { data, error } = await supabase
            .from('user_wallets')
            .select('*')
            .eq('user_id', userId)
            .single();
        
        if (error) {
            console.error('Wallet fetch error:', error);
            return res.status(500).json({ error: error.message });
        }
        
        res.json({ success: true, data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 2. Technician recruitment application
router.post("/apply", async (req, res) => {
    try {
        const { name, email, phone, experience, qualifications } = req.body;

        // Validate required fields
        if (!name || !email || !phone) {
            return res.status(400).json({ 
                error: 'Missing required fields: name, email, phone' 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        const { data, error } = await supabase
            .from('technician_profiles')
            .insert([{
                name,
                email,
                phone,
                experience: experience || null,
                qualifications: qualifications || null,
                status: 'pending',
                created_at: new Date().toISOString()
            }]);
        
        if (error) {
            console.error('Technician insert error:', error);
            return res.status(500).json({ error: error.message });
        }
        
        res.status(201).json({ 
            success: true, 
            message: "تم تسجيل طلبك بنجاح. سيتم التواصل معك قريباً",
            data
        });
    } catch (error) {
        console.error('Apply endpoint error:', error);
        res.status(500).json({ error: error.message });
    }
});

// 3. Admin login endpoint
router.post("/auth/login", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Missing credentials' });
        }

        // Verify against environment variables
        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) {
            console.error('Admin credentials not configured');
            return res.status(500).json({ error: 'Server configuration error' });
        }

        if (username !== adminUsername) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Compare password with hash
        const passwordMatch = await bcrypt.compare(password, adminPasswordHash);
        
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // TODO: Generate JWT token
        res.json({ 
            success: true, 
            message: 'تسجيل دخول ناجح',
            token: 'jwt_token_here' 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
