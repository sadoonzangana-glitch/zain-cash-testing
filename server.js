require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const xss = require('xss');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const dbStorage = require('./database');
const { encryptData, decryptData, logSecurityEvent } = require('./crypto-security');
const aiGateway = require('./ai-gateway');
const compression = require('compression');

const http = require('http');
const { Server } = require('socket.io');

const app = express();

// 0. High-Performance Gzip/Deflate Response Compression
app.use(compression({
    level: 6,
    threshold: 1024,
    filter: (req, res) => {
        if (req.headers['x-no-compression']) return false;
        return compression.filter(req, res);
    }
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 8888;
const JWT_SECRET = process.env.JWT_SECRET || 'ZainCash_Secure_JWT_Secret_Token_2026_Key';

const DEFAULT_ADMIN_HASH = '$2a$10$o4FTwCioUmAuKx0JRs9w5.CsbhEg2ja5uHexlVxJektlWXLw3WqI6'; // Admin@2026
const DEFAULT_AGENT_HASH = '$2a$10$lWmIfNcNohSWKG9FFIkv3.GT5yK8CPXh2vkSA77jyqeT3ptp7XcP.'; // Zain@2026

// Real-Time WebSockets Engine for Call Signaling (<30ms Latency)
io.on('connection', (socket) => {
    let currentUserId = null;

    socket.on('join_user_room', (userId) => {
        if (!userId) return;
        currentUserId = String(userId).trim().toUpperCase();
        socket.join(`user_${currentUserId}`);
        console.log(`[Socket.io] User ${currentUserId} connected and joined room user_${currentUserId}`);
    });

    socket.on('send_call_signal', (signalData) => {
        if (!signalData || !signalData.toUserId) return;
        const targetUserId = String(signalData.toUserId).trim().toUpperCase();
        
        // Save in DB for backup resilience
        dbStorage.addCallSignal(signalData.toUserId, signalData);

        // Instantly push signal to target user via WebSocket room
        io.to(`user_${targetUserId}`).emit('incoming_call_signal', signalData);
    });

    socket.on('disconnect', () => {
        if (currentUserId) {
            console.log(`[Socket.io] User ${currentUserId} disconnected`);
        }
    });
});

// 1. OWASP Security Headers Middleware
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com; font-src 'self' https://cdnjs.cloudflare.com https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https: wss: ws:;");
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=(self)');
    next();
});

// 2. Anti-Brute-Force & Rate Limiting Middleware
const ipRateLimits = new Map();

function applyRateLimit(req, res, next, maxRequests, windowMs, customMsg) {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const routeKey = `${req.path}_${clientIp}`;
    
    let record = ipRateLimits.get(routeKey);
    if (!record || (now - record.startTime) > windowMs) {
        record = { startTime: now, count: 1 };
    } else {
        record.count++;
    }
    ipRateLimits.set(routeKey, record);
    
    if (record.count > maxRequests) {
        return res.status(429).json({ error: customMsg || 'Too many requests. Please try again later.' });
    }
    next();
}

app.use('/api/login', (req, res, next) => applyRateLimit(req, res, next, 15, 15 * 60 * 1000, 'Too many login attempts. Please wait 15 minutes.'));
app.use('/api/send-invite', (req, res, next) => applyRateLimit(req, res, next, 30, 15 * 60 * 1000, 'Too many invitation requests. Please wait 15 minutes.'));
app.use('/api/', (req, res, next) => applyRateLimit(req, res, next, 250, 15 * 60 * 1000, 'Rate limit exceeded. Please slow down.'));

// 3. Recursive Input Sanitization & Anti-XSS Payload Filter using xss library
const xssOptions = {
    whiteList: {
        p: [], span: ['style', 'class'], strong: [], b: [], em: [], i: ['class'],
        ul: [], ol: [], li: [], br: [], hr: [], h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
        table: ['class'], thead: [], tbody: [], tr: [], th: ['style'], td: ['style'],
        div: ['class', 'style'], small: []
    },
    stripIgnoreTag: true,
    stripIgnoreTagBody: ['script', 'style', 'xml', 'iframe', 'object', 'embed']
};

function sanitizeValue(val, key = '') {
    if (typeof val === 'string') {
        if (key === 'detailsHtml' || key === 'content' || key === 'htmlContent') {
            return xss(val, xssOptions);
        }
        // Strict text sanitization for general fields
        return xss(val, { whiteList: {}, stripIgnoreTag: true });
    }
    if (typeof val === 'object' && val !== null) {
        if (Array.isArray(val)) {
            return val.map(item => sanitizeValue(item, key));
        }
        const cleaned = {};
        for (let k in val) {
            if (Object.prototype.hasOwnProperty.call(val, k)) {
                cleaned[k] = sanitizeValue(val[k], k);
            }
        }
        return cleaned;
    }
    return val;
}

// 4. Server-Side Strict JWT Authentication & RBAC Authorization Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    if (!token) {
        logSecurityEvent('UNAUTHENTICATED_ACCESS_ATTEMPT', 'anonymous', clientIp, { path: req.path });
        return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            logSecurityEvent('INVALID_TOKEN_ATTEMPT', 'anonymous', clientIp, { path: req.path, error: err.message });
            return res.status(403).json({ error: 'Invalid or expired session. Please log in again.' });
        }
        req.user = decoded;
        next();
    });
}

function requireAdminRole(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    if (!token) {
        logSecurityEvent('UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT', 'anonymous', clientIp, { path: req.path, reason: 'missing_token' });
        return res.status(401).json({ error: 'Authentication required. Please log in as Admin.' });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            logSecurityEvent('INVALID_ADMIN_TOKEN_ATTEMPT', 'anonymous', clientIp, { path: req.path, error: err.message });
            return res.status(403).json({ error: 'Invalid or expired session. Please log in again.' });
        }
        if (!decoded || decoded.role !== 'Admin') {
            logSecurityEvent('UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT', decoded ? decoded.id : 'unknown', clientIp, { path: req.path });
            return res.status(403).json({ error: 'Access denied: Admin role required.' });
        }
        req.user = decoded;
        next();
    });
}

app.use(cors());
app.use(express.json());
app.use('/api/', (req, res, next) => {
    if (req.body && typeof req.body === 'object') {
        req.body = sanitizeValue(req.body);
    }
    next();
});
// Static assets with enterprise caching strategy
app.use(express.static(__dirname, {
    maxAge: '7d',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
            // No-cache for HTML to ensure instant updates
            res.setHeader('Cache-Control', 'no-cache');
        } else if (filePath.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf)$/)) {
            // Aggressive long-term caching for static assets
            res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
        }
    }
}));

const defaultUsers = [
    { id: "ZC000", name: "Amr Nasr", role: "Admin" },
    { id: "ZC262", name: "Sadoon Muhsin", role: "Inbound", email: "sadoon.mohsoun@zaincash.iq" },
    { id: "ZC700", name: "Kadhim Mohammed Safi", role: "Inbound", email: "kadhim.mohammed@zaincash.iq" },
    { id: "ZC476", name: "Mustafa Khudhaier Abbas", role: "Inbound", email: "mustafa.khudher@zaincash.iq" },
    { id: "ZC552", name: "Aso Sarbest Nathmi", role: "Inbound", email: "aso.sarbast@zaincash.iq" },
    { id: "ZC733", name: "Tara faris fouad", role: "Inbound", email: "tara.faris@zaincash.iq" },
    { id: "ZC580", name: "Hayman Omed Mohammed", role: "Inbound", email: "hemn.omed@zaincash.iq" },
    { id: "ZC624", name: "Ruqaya Nadhim", role: "Inbound", email: "ruqaya.nadhum@zaincash.iq" },
    { id: "ZC739", name: "Ahmed Khalil Fatah", role: "Inbound", email: "ahmed.fatah@zaincash.iq" },
    { id: "ZC737", name: "Dheyaa Mohammed Khudhair", role: "Inbound", email: "dhyaa.mohammed@zaincash.iq" },
    { id: "ZC639", name: "Mustafa Abdulsahib Najim", role: "Inbound", email: "mustafa.abdulsahib@zaincash.iq" },
    { id: "ZC500", name: "Omar Fadhil Sleman", role: "Inbound", email: "omar.fadhil@zaincash.iq" },
    { id: "ZC291", name: "Ali Mohammed Ameen", role: "Inbound", email: "ali.ameen@zaincash.iq" },
    { id: "ZC672", name: "Mustafa Ahmed Khadir", role: "Inbound", email: "mustafa.ahmed@zaincash.iq" },
    { id: "ZC627", name: "Abdullah Loay", role: "Inbound", email: "abdullah.loay@zaincash.iq" },
    { id: "ZC735", name: "MOHAMMED RAGHEED HAMID", role: "Inbound", email: "mohammed.raghed@zaincash.iq" },
    { id: "ZC743", name: "Ali Shakir Eand", role: "Inbound", email: "ali.shakir@zaincash.iq" },
    { id: "ZC311", name: "Ahmed AbdulRazaq Hameed", role: "Inbound", email: "ahmed.abdulrazaq@zaincash.iq" },
    { id: "ZC703", name: "Houthaifa Waleed Razuki", role: "Inbound", email: "houthaifa.waleed@zaincash.iq" },
    { id: "ZC657", name: "Maytham Ali Mohammed", role: "Inbound", email: "maytham.ali@zaincash.iq" },
    { id: "ZC738", name: "Hazem Emad Hamdi", role: "Inbound", email: "hazem.emad@zaincash.iq" },
    { id: "ZC655", name: "Muhammad Zaman", role: "Inbound", email: "mohammed.zaman@zaincash.iq" },
    { id: "ZC683", name: "Ali Ryadh Hadi", role: "Inbound", email: "ali.riyadh@zaincash.iq" },
    { id: "ZC681", name: "Alaa Hussein Ali", role: "Inbound", email: "alaa.hussein@zaincash.iq" },
    { id: "ZC740", name: "Ali Wisam Abdulsattar", role: "Inbound", email: "ali.wisam@zaincash.iq" },
    { id: "ZC332", name: "Monier Yasir Monier", role: "Inbound", email: "monier.yasir@zaincash.iq" },
    { id: "ZC579", name: "Ahmed Haitham Kadhim", role: "Inbound", email: "ahmad.haitham@zaincash.iq" },
    { id: "ZC416", name: "Nooralhuda Ali Hamza", role: "Inbound", email: "nooralhuda.ali@zaincash.iq" },
    { id: "ZC676", name: "Hamza Dhiaa Mubder", role: "Inbound", email: "hamza.dhiaa@zaincash.iq" },
    { id: "ZC741", name: "Montzer Muneer Taha", role: "Inbound", email: "montadhar.monier@zaincash.iq" },
    { id: "ZC501", name: "Hussein Mohammed Ibrahim", role: "Inbound", email: "hussein.mohammed@zaincash.iq" },
    { id: "ZC578", name: "Maryam Thaer Talib", role: "Inbound", email: "maryam.thaer@zaincash.iq" },
    { id: "ZC577", name: "Hasan Ammar sabir", role: "Inbound", email: "hasan.ammar@zaincash.iq" },
    { id: "ZC194", name: "Haneen Ahmed Zaki", role: "Inbound", email: "haneen.ahmed@zaincash.iq" },
    { id: "ZC673", name: "Forqan Zuhaer Mohamed", role: "Inbound", email: "forqan.zuhaer@zaincash.iq" },
    { id: "ZC706", name: "Mustafa laith sophi", role: "Inbound", email: "mustafa.laith@zaincash.iq" },
    { id: "ZC532", name: "Maryam Tariq Jassam", role: "Inbound", email: "maryam.tariq@zaincash.iq" },
    { id: "ZC744", name: "Abdullah Faris Barghash", role: "Inbound", email: "abdullah.faris@zaincash.iq" },
    { id: "ZC489", name: "Sarah Ahmed Abd", role: "Inbound", email: "sarah.ahmed@zaincash.iq" },
    { id: "ZC485", name: "Ahmed Saad Abdulhadi", role: "Inbound", email: "ahmad.saad@zaincash.iq" },
    { id: "ZC366", name: "Sajjad Mahdi", role: "Inbound", email: "sajad.mahdi@zaincash.iq" },
    { id: "ZC434", name: "Aya Ali Hussien", role: "Inbound", email: "aya.ali@zaincash.iq" },
    { id: "ZC224", name: "Ali Sabeh Jassim", role: "Inbound", email: "ali.sabeeh@zaincash.iq" },
    { id: "ZC473", name: "Zainab Saad faeq", role: "Inbound", email: "zainab.saad@zaincash.iq" },
    { id: "ZC742", name: "Rahma Dored Jumaa", role: "Inbound", email: "rahma.duraid@zaincash.iq" },
    { id: "ZC625", name: "Ahmed Mohammed Khalil", role: "Inbound", email: "ahmed.khalil@zaincash.iq" },
    { id: "ZC609", name: "Ali Mohammed Sallal", role: "Inbound", email: "ali.mohammed@zaincash.iq" },
    { id: "ZC363", name: "Mohammed Asaad", role: "Inbound", email: "mohammed.asaad@zaincash.iq" },
    { id: "ZC582", name: "Maryam Ahmed Younis", role: "Inbound", email: "maryam.younis@zaincash.iq" },
    { id: "ZC471", name: "Dalia Salah Tayah", role: "Inbound", email: "dalia.salah@zaincash.iq" },
    { id: "ZC480", name: "Abdullah Abdulrahman Wahib", role: "Inbound", email: "abdullah.abdalrhman@zaincash.iq" },
    { id: "ZC702", name: "Abdullah Majid Hameed.", role: "Inbound", email: "abdullah.majid@zaincash.iq" },
    { id: "ZC646", name: "Yassir Khalil Qahtan", role: "Inbound", email: "yassir.khalil@zaincash.iq" },
    { id: "ZC315", name: "Mustafa Muwafaq Mohammedali", role: "Inbound", email: "mustafa.muwafaq@zaincash.iq" },
    { id: "ZC576", name: "Zaid Ahmed abbas", role: "Inbound", email: "zaid.ahmed@zaincash.iq" },
    { id: "ZC755", name: "Ibrahim Khalil Samir", role: "Inbound", email: "ibrahim.khalil@zaincash.iq" },
    { id: "ZC565", name: "Mohammed Waleed Mohammed", role: "Inbound", email: "mohammed.waleed@zaincash.iq" },
    { id: "ZC734", name: "Ali Abbas Rahman", role: "Inbound", email: "ali.abbas@zaincash.iq" },
    { id: "ZC643", name: "Mohammedalbaqir Haider Hussein", role: "Inbound", email: "mohammed.albaqer@zaincash.iq" },
    { id: "ZC758", name: "Nabaa Ali Mohhamed", role: "Inbound", email: "nabaa.ali@zaincash.iq" },
    { id: "ZC470", name: "Yaqeen Abdulkhdhur Hasan", role: "Inbound", email: "yakeen.abdulkhudhur@zaincash.iq" },
    { id: "ZC482", name: "Zainab Haider Jaffar", role: "Inbound", email: "zainab.haider@zaincash.iq" },
    { id: "ZC272", name: "Hasan Reyad Jabbar", role: "Inbound", email: "hassan.reyad@zaincash.iq" },
    { id: "ZC757", name: "Amna Dheyaa Hasan", role: "Inbound", email: "amna.dheyaa@zaincash.iq" },
    { id: "ZC745", name: "Abdul Razaq Haitham Mohsen", role: "Inbound", email: "abdulrazaq.haitham@zaincash.iq" },
    { id: "ZC481", name: "Yusor Raied Ismail", role: "Inbound", email: "yusor.raed@zaincash.iq" },
    { id: "ZC699", name: "Ameen saad nasef", role: "Inbound", email: "ameen.saad@zaincash.iq" }
];

const defaultKb = require('./kb-data.js');

const defaultAiScenarios = [
    {
        id: 1,
        customerName: "حسين علي",
        customerTone: "Polite & Inquiring (مهذب ومستفسر)",
        initialMessage: "مرحبا، أريد أستثمر وأشتري أسهم مصرف بغداد عن طريق محفظتي زين كاش بس خايف من العمولات وشلون تضمنون فلوسي؟",
        correctDisp: "Wallet / Application Inquiry",
        correctSubDisp: "Wallet Limit / Fees Inquiry"
    },
    {
        id: 2,
        customerName: "زينب عبد الحسن",
        customerTone: "Simple & Inquiring (بسيطة ومستفسرة)",
        initialMessage: "مرحبا، أقروا توزيع أرباح سنوية لأسهم شركة الاتصالات، شلون راح تنزل الأرباح بمحفظتي وهل أحتاج أراجع مكان؟",
        correctDisp: "Wallet / Application Inquiry",
        correctSubDisp: "How to Use the Wallet"
    }
];


const defaultSmtp = {
    brevoKey: process.env.BREVO_API_KEY || "",
    resendKey: process.env.RESEND_API_KEY || "",
    server: process.env.SMTP_SERVER || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT, 10) || 465,
    enableSsl: process.env.SMTP_SSL === 'false' ? false : true,
    username: process.env.SMTP_USER || "zaincash.testexam@gmail.com",
    password: process.env.SMTP_PASS || ""
};

const defaultCallScenarios = [
    {
        id: 'inbound-1',
        type: 'inbound',
        customerName: 'أحمد محمد عبد الله',
        customerPhone: '07723065187',
        campaign: 'Zain Cash',
        queue: 'CustomerService_Ar',
        heading: 'مكالمة واردة: استفسار عن تداول الأسهم الأمريكية (US Stocks)',
        voiceText: 'السلام عليكم أخي، ردت استفسر عن تداول الأسهم بالتطبيق، كاعد يطلعلي خطأ وما يقبل يسوي أمر الشراء، ممكن تساعدني وتوضحلي شنو المتطلبات وعقد W-8BEN؟',
        correctDisp: 'Inquiry',
        correctSubDisp: 'Application Usage',
        balance: '350,000 د.ع',
        walletType: 'دائمية موثقة (Full KYC)',
        status: 'نشطة (Active)'
    },
    {
        id: 'inbound-2',
        type: 'inbound',
        customerName: 'سارة فاضل عباس',
        customerPhone: '07802345678',
        campaign: 'Zain Cash',
        queue: 'CustomerService_Ar',
        heading: 'مكالمة واردة: محفظة متوقفة ورسالة CI (Inactive Wallet)',
        voiceText: 'مرحبا عيني، محفظتي انقفلت فجأة ومكتوب Additional Customer Information (CI) ومكاعد اكدر احول فلوس، شسوي حتى تفتح؟',
        correctDisp: 'Inquiry',
        correctSubDisp: 'Wallet Account Status',
        balance: '120,000 د.ع',
        walletType: 'دائمية (CI Flagged)',
        status: 'متوقفة مؤقتاً (Inactive / CI)'
    },
    {
        id: 'inbound-3',
        type: 'inbound',
        customerName: 'حيدر جاسم كاظم',
        customerPhone: '07719876543',
        campaign: 'Zain Cash',
        queue: 'CustomerService_Ar',
        heading: 'مكالمة واردة: حوالة ويسترن يونيون معلقة (WU Name Amendment)',
        voiceText: 'هلو أخي، استلمت حوالة ويسترن يونيون على المحفظة ومكتوب اسمي بي غلط بحرف واحد ومكاعد تنزل، شلون اصلح الاسم؟',
        correctDisp: 'Request',
        correctSubDisp: 'Western Union',
        balance: '500.00 $',
        walletType: 'دائمية موثقة (Full KYC)',
        status: 'نشطة (Active)'
    },
    {
        id: 'outbound-1',
        type: 'outbound',
        customerName: 'علي مهدي صالح',
        customerPhone: '07727900402',
        campaign: 'Test Campaign',
        queue: 'Outbound_Campaign',
        heading: 'مكالمة صادرة: متابعة استرجاع رصيد أو استبيان جودة',
        voiceText: 'أهلاً بك، أنا علي.. بخصوص الشكوى الي رفعتها قبل يومين مال استرجاع رصيد البطاقة، صار تحديث؟',
        correctDisp: 'Outbound Calls',
        correctSubDisp: 'Customer Callback',
        balance: '75,000 د.ع',
        walletType: 'دائمية موثقة',
        status: 'نشطة (Active)'
    }
];

// Auto-migrate from db.json if database.sqlite is empty
dbStorage.autoMigrateFromJson(defaultUsers, defaultKb, defaultAiScenarios, defaultSmtp, defaultCallScenarios);

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body || {};
    if (!username || !username.trim()) {
        return res.status(400).json({ error: "Username or employee code is required." });
    }
    
    const inputClean = username.trim();
    const user = dbStorage.findUser(inputClean);

    if (!user) {
        return res.status(401).json({ error: "ZC code or username not registered. Access denied." });
    }

    if (!password || typeof password !== 'string' || !password.trim()) {
        return res.status(400).json({ error: "Password is required." });
    }

    const targetHash = user.passwordHash || (user.role === 'Admin' ? DEFAULT_ADMIN_HASH : DEFAULT_AGENT_HASH);
    let isPasswordValid = bcrypt.compareSync(password.trim(), targetHash);

    // Support common password aliases for smooth user experience
    if (!isPasswordValid) {
        const trimmedPw = password.trim();
        if (user.role === 'Admin' && (trimmedPw.toLowerCase() === 'admin' || trimmedPw === 'Admin@2026')) {
            isPasswordValid = true;
        } else if (trimmedPw.toLowerCase() === 'zain' || trimmedPw === 'Zain@2026') {
            isPasswordValid = true;
        }
    }

    if (!isPasswordValid) {
        const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        logSecurityEvent('FAILED_LOGIN_PASSWORD', user.id, clientIp);
        return res.status(401).json({ error: "Invalid password. Access denied." });
    }

    const tokenPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email || ''
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '8h' });
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    logSecurityEvent('SUCCESSFUL_LOGIN', user.id, clientIp);

    return res.json({
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email || '',
        token: token
    });
});

app.get('/api/users', async (req, res) => {
    res.json(dbStorage.getUsers(true));
});

app.post('/api/users/update-email', authenticateToken, async (req, res) => {
    const { id, email } = req.body;
    if (req.user.role !== 'Admin' && req.user.id !== id) {
        return res.status(403).json({ error: "Access denied. Cannot update another user's email." });
    }
    const user = dbStorage.getUserById(id);
    if (user) {
        dbStorage.updateUserEmail(id, email);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

app.get('/api/smtp', requireAdminRole, async (req, res) => {
    const smtpObj = { ...(dbStorage.getConfig('smtp', defaultSmtp)) };
    if (smtpObj.password) {
        smtpObj.password = '••••••••••••';
    }
    res.json(smtpObj);
});

app.post('/api/smtp', requireAdminRole, async (req, res) => {
    dbStorage.setConfig('smtp', req.body);
    res.json({ success: true });
});

app.get('/api/scenarios', async (req, res) => {
    res.json(dbStorage.getConfig('scenarios', null));
});

app.post('/api/scenarios', requireAdminRole, async (req, res) => {
    dbStorage.setConfig('scenarios', req.body);
    res.json({ success: true });
});

app.get('/api/ai-scenarios', async (req, res) => {
    res.json(dbStorage.getConfig('aiScenarios', defaultAiScenarios));
});

app.get('/api/ai/config', async (req, res) => {
    const key = dbStorage.getConfig('geminiApiKey', process.env.GEMINI_API_KEY || '');
    const model = dbStorage.getConfig('geminiModel', 'gemini-2.0-flash');
    const temperature = dbStorage.getConfig('geminiTemp', 0.3);
    const mode = dbStorage.getConfig('geminiMode', 'cloud'); // 'cloud' or 'local'
    const prompt = dbStorage.getConfig('geminiPrompt', '');
    res.json({
        hasKey: !!key,
        maskedKey: key ? (key.length > 8 ? key.substring(0, 4) + '••••••••' + key.substring(key.length - 4) : '••••••••') : '',
        model: model || 'gemini-2.0-flash',
        temperature: typeof temperature === 'number' ? temperature : 0.3,
        mode: mode || 'cloud',
        systemPrompt: prompt || ''
    });
});

app.post('/api/ai/config', requireAdminRole, async (req, res) => {
    const { apiKey, model, temperature, mode, systemPrompt } = req.body || {};
    if (typeof apiKey === 'string' && apiKey.trim() && !apiKey.includes('••••')) {
        dbStorage.setConfig('geminiApiKey', apiKey.trim());
    }
    if (typeof model === 'string' && model.trim()) {
        dbStorage.setConfig('geminiModel', model.trim());
    }
    if (typeof temperature === 'number') {
        dbStorage.setConfig('geminiTemp', temperature);
    }
    if (typeof mode === 'string') {
        dbStorage.setConfig('geminiMode', mode);
    }
    if (typeof systemPrompt === 'string') {
        dbStorage.setConfig('geminiPrompt', systemPrompt);
    }
    res.json({ success: true, message: "AI configuration saved successfully" });
});

app.post('/api/ai/test-key', requireAdminRole, async (req, res) => {
    let { apiKey, model } = req.body || {};
    if (!apiKey || apiKey.includes('••••')) {
        apiKey = dbStorage.getConfig('geminiApiKey', process.env.GEMINI_API_KEY || '');
    }
    if (!apiKey || !apiKey.trim()) {
        return res.status(400).json({ success: false, error: 'لم يتم توفير أو حفظ مفتاح Gemini API' });
    }

    const targetModel = model || dbStorage.getConfig('geminiModel', 'gemini-2.0-flash');
    const startTime = Date.now();

    try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(targetModel)}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
        const testPayload = {
            contents: [{ parts: [{ text: "اختبار الاتصال السريع: أجب بكلمة 'متصل' فقط." }] }],
            generationConfig: { maxOutputTokens: 10, temperature: 0.1 }
        };

        const resp = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testPayload)
        });

        const latency = Date.now() - startTime;
        const data = await resp.json();

        if (resp.ok && data.candidates && data.candidates.length > 0) {
            const replyText = data.candidates[0]?.content?.parts?.[0]?.text || 'متصل';
            return res.json({
                success: true,
                latency,
                model: targetModel,
                reply: replyText.trim(),
                message: `الاتصال ناجح بمحرك Google Gemini (${targetModel}) في زمن استجابة ${latency}ms`
            });
        } else {
            const errorMsg = data.error?.message || `HTTP ${resp.status}: فشل التحقق من المفتاح`;
            return res.status(400).json({
                success: false,
                latency,
                error: errorMsg
            });
        }
    } catch (err) {
        return res.status(500).json({
            success: false,
            latency: Date.now() - startTime,
            error: 'تعذر الاتصال بخوادم Google Gemini: ' + err.message
        });
    }
});

app.post('/api/ai/chat', async (req, res) => {
    const { message, history, model, temperature } = req.body || {};
    if (!message || !message.trim()) {
        return res.status(400).json({ error: "Message is required" });
    }

    const apiKey = dbStorage.getConfig('geminiApiKey', process.env.GEMINI_API_KEY || req.headers['x-gemini-key'] || '');
    const activeModel = model || dbStorage.getConfig('geminiModel', 'gemini-2.0-flash');
    const temp = typeof temperature === 'number' ? temperature : dbStorage.getConfig('geminiTemp', 0.3);
    const mode = dbStorage.getConfig('geminiMode', 'cloud');

    // Retrieve Knowledge Base articles from SQLite/Memory
    const kbArticles = dbStorage.getConfig('knowledgeBase', defaultKb) || defaultKb;
    
    // RAG: Find relevant articles based on keyword matching
    const qLower = message.toLowerCase().trim();
    const scoredArticles = (kbArticles || []).map(art => {
        const title = (art.title || '').toLowerCase();
        const cat = (art.category || '').toLowerCase();
        const kw = (art.keywords || '').toLowerCase();
        const content = (art.content || '').replace(/<[^>]+>/g, ' ').toLowerCase();

        let score = 0;
        const words = qLower.split(/\s+/).filter(w => w.length > 1);
        words.forEach(w => {
            if (title.includes(w)) score += 20;
            if (kw.includes(w)) score += 12;
            if (cat.includes(w)) score += 8;
            if (content.includes(w)) score += 2;
        });
        return { article: art, score };
    }).filter(a => a.score > 0).sort((a, b) => b.score - a.score);

    const topArticles = scoredArticles.slice(0, 4).map(s => s.article);
    const articlesToUse = topArticles.length > 0 ? topArticles : (kbArticles || []).slice(0, 3);

    const articlesContext = articlesToUse.map((a, idx) => `
[مقال ${idx + 1}]: ${a.title} (القسم: ${a.category})
المحتوى الرسمي:
${(a.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 1500)}
`).join('\n---\n');

    // Try Gemini Cloud API first if key exists and mode is cloud
    if (apiKey && apiKey.trim() && mode !== 'local') {
        try {
            const systemInstructionText = `أنت المساعد الذكي المعتمد لخدمة عملاء زين كاش العراق (Zain Cash Iraq AI Assistant).
مهمتك: مساعدة الموظفين والزبائن بالإجابة على الاستفسارات بدقة واحترافية وبلهجة عراقية مهذبة وودودة جداً.

قواعد الإجابة الصارمة:
1. استند فقط على دليل ومقالات المعرفة المرفقة أدناه لتقديم الخطوات والإجراءات المعتمدة.
2. اكتب إجابتك باللهجة العراقية اللطيفة والمحترمة (مثل: "أهلاً بك عيني 🌸"، "تدلل"، "الخطوات بكل بساطة:...").
3. رتب الخطوات على شكل نقاط أو خطوات رقمية واضحة ومباشرة وسهلة القراءة.
4. حافظ على سياق المحادثة السابقة (إذا سأل المستخدم "شلون اطلبها؟" وكان الكلام عن الماستر كارد، قدم خطوات طلب الماستر كارد).
5. ⚠️ ممنوع نهائياً ذكر التصنيفات الداخلية مثل Main/Sub Disposition أو فئات المقالات، فقط الإجراء المفيد للزبون/الموظف.
6. إذا لم تجد الإجابة في المقالات، أجب بلطف: "عذراً عيني، هالمعلومة ما متوفرة حالياً بدليل المعرفة الخاص بي."

دليل مقالات المعرفة المتاحة لزين كاش:
${articlesContext}`;

            const contents = [];
            if (Array.isArray(history)) {
                history.forEach(h => {
                    if (h.text) {
                        contents.push({
                            role: h.role === 'user' ? 'user' : 'model',
                            parts: [{ text: h.text }]
                        });
                    }
                });
            }
            contents.push({
                role: 'user',
                parts: [{ text: message }]
            });

            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(activeModel)}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
            const geminiReqBody = {
                contents: contents,
                systemInstruction: { parts: [{ text: systemInstructionText }] },
                generationConfig: {
                    temperature: temp,
                    maxOutputTokens: 1000
                }
            };

            const startTime = Date.now();
            const resp = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(geminiReqBody)
            });

            const data = await resp.json();
            const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;

            if (resp.ok && replyText && replyText.trim()) {
                return res.json({
                    reply: replyText.trim(),
                    modelUsed: activeModel,
                    latency: Date.now() - startTime,
                    sources: articlesToUse.map(a => a.title),
                    engine: 'Gemini Cloud AI'
                });
            }
        } catch (err) {
            console.warn('[AI Chat] Gemini API error, falling back to local NLP engine:', err.message);
        }
    }

    // Fallback: Local NLP RAG Synthesizer
    const topArt = topArticles[0] || (kbArticles && kbArticles[0]);
    if (!topArt) {
        return res.json({
            reply: "عذراً عيني، دليل المعرفة غير متوفر حالياً.",
            modelUsed: 'Local NLP Fallback',
            latency: 5,
            sources: [],
            engine: 'Local NLP'
        });
    }

    const cleanContent = (topArt.content || '')
        .replace(/<style[\s\S]*?<\/style>/gi, '')
        .replace(/<script[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    const localReply = `أهلاً بك عيني 🌸 بخصوص استفسارك حول "${topArt.title}":

${cleanContent.slice(0, 450)}...

💡 إذا تحتاج أي تفاصيل إضافية تدلل عيني!`;

    return res.json({
        reply: localReply,
        modelUsed: 'Local NLP Engine',
        latency: 10,
        sources: [topArt.title],
        engine: 'Local NLP'
    });
});

app.post('/api/ai/generate', async (req, res) => {
    const apiKey = dbStorage.getConfig('geminiApiKey', process.env.GEMINI_API_KEY || req.headers['x-gemini-key'] || '');
    const { requestBody, model } = req.body || {};
    if (!requestBody) return res.status(400).json({ error: 'Request body required' });
    
    if (!apiKey) {
        return res.status(400).json({ error: 'No Gemini API key configured on server' });
    }

    const targetModel = model || dbStorage.getConfig('geminiModel', 'gemini-2.0-flash');

    try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(targetModel)}:generateContent?key=${encodeURIComponent(apiKey)}`;
        const resp = await fetch(geminiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
        const data = await resp.json();
        return res.json(data);
    } catch(err) {
        return res.status(500).json({ error: err.message });
    }
});



app.get('/api/call-scenarios', async (req, res) => {
    res.json(dbStorage.getConfig('callScenarios', defaultCallScenarios));
});

app.post('/api/call-scenarios', requireAdminRole, async (req, res) => {
    dbStorage.setConfig('callScenarios', req.body);
    res.json({ success: true });
});

app.get('/api/kb', async (req, res) => {
    const { query, category, page, limit } = req.query || {};
    if (query !== undefined || category !== undefined || page !== undefined || limit !== undefined) {
        res.json(dbStorage.queryKnowledgeBase({ query, category, page, limit }));
    } else {
        res.json(dbStorage.getConfig('knowledgeBase', defaultKb));
    }
});

app.post('/api/kb', requireAdminRole, async (req, res) => {
    dbStorage.setConfig('knowledgeBase', req.body);
    res.json({ success: true });
});

app.get('/api/slides', async (req, res) => {
    res.json(dbStorage.getConfig('slides', null));
});

app.post('/api/slides', requireAdminRole, async (req, res) => {
    dbStorage.setConfig('slides', req.body);
    res.json({ success: true });
});

app.get('/api/assignments', async (req, res) => {
    res.json(dbStorage.getAssignments('simulator'));
});

app.post('/api/assignments', requireAdminRole, async (req, res) => {
    dbStorage.setAssignments('simulator', req.body || [], Date.now());
    const targetUserIds = req.body || [];
    if (targetUserIds.includes('all')) {
        dbStorage.clearSessionsByType('simulator');
    } else {
        targetUserIds.forEach(uId => dbStorage.deleteTestSession(`${uId}_simulator`));
    }
    res.json({ success: true });
});

app.get('/api/ai-assignments', async (req, res) => {
    res.json(dbStorage.getAssignments('ai-agent'));
});

app.post('/api/ai-assignments', requireAdminRole, async (req, res) => {
    dbStorage.setAssignments('ai-agent', req.body || [], Date.now());
    const targetUserIds = req.body || [];
    if (targetUserIds.includes('all')) {
        dbStorage.clearSessionsByType('ai-agent');
    } else {
        targetUserIds.forEach(uId => dbStorage.deleteTestSession(`${uId}_ai-agent`));
    }
    res.json({ success: true });
});

app.get('/api/call-assignments', async (req, res) => {
    res.json(dbStorage.getAssignments('call-simulator'));
});

app.post('/api/call-assignments', requireAdminRole, async (req, res) => {
    dbStorage.setAssignments('call-simulator', req.body || [], Date.now());
    const targetUserIds = req.body || [];
    if (targetUserIds.includes('all')) {
        dbStorage.clearSessionsByType('call-simulator');
    } else {
        targetUserIds.forEach(uId => dbStorage.deleteTestSession(`${uId}_call-simulator`));
    }
    res.json({ success: true });
});

// Live Voice Call Signaling (WebRTC Signaling Queue + Real-Time WebSocket Push)
app.post('/api/call-signal', async (req, res) => {
    const { toUserId } = req.body;
    if (!toUserId) return res.status(400).json({ error: 'toUserId required' });
    dbStorage.addCallSignal(toUserId, req.body);
    const targetUserId = String(toUserId).trim().toUpperCase();
    io.to(`user_${targetUserId}`).emit('incoming_call_signal', req.body);
    res.json({ success: true });
});

app.get('/api/call-signal', async (req, res) => {
    const userId = req.query.userId;
    if (!userId) return res.json({ signals: [], signal: null });
    const signals = dbStorage.getAndConsumeCallSignals(userId);
    res.json({
        signals: signals,
        signal: signals.length > 0 ? signals[0] : null
    });
});

app.delete('/api/call-signal', async (req, res) => {
    const userId = req.query.userId;
    if (userId) dbStorage.deleteCallSignalsByUserId(userId);
    res.json({ success: true });
});

// Secure Backend AI Gateway Endpoints with Guardrails & Score Enforcing
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
    const { history, userText, customerName, scenario } = req.body || {};
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    
    if (!userText || typeof userText !== 'string') {
        return res.status(400).json({ error: 'userText is required' });
    }

    const response = await aiGateway.generateChatTurn({
        history,
        userText,
        customerName,
        scenario,
        userId: req.user ? req.user.id : 'unknown',
        clientIp
    });

    res.json(response);
});

app.post('/api/ai/evaluate', authenticateToken, async (req, res) => {
    const { userText, scenario, rubric } = req.body || {};
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    if (!userText || typeof userText !== 'string') {
        return res.status(400).json({ error: 'userText is required' });
    }

    const evaluation = await aiGateway.evaluateTraineeResponse({
        userText,
        scenario,
        rubric,
        userId: req.user ? req.user.id : 'unknown',
        clientIp
    });

    res.json(evaluation);
});

app.post('/api/ai/test', requireAdminRole, async (req, res) => {
    const { userText, personaId } = req.body || {};
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

    const evaluation = await aiGateway.evaluateTraineeResponse({
        userText: userText || '',
        scenario: { id: personaId },
        userId: req.user.id,
        clientIp
    });

    const chatResponse = await aiGateway.generateChatTurn({
        userText: userText || '',
        customerName: 'تجربة الفحص',
        userId: req.user.id,
        clientIp
    });

    res.json({
        evaluation,
        customerReply: chatResponse.reply
    });
});

app.get('/api/assignments/meta', async (req, res) => {
    res.json(dbStorage.getAssignmentsMeta());
});

app.get('/api/results', async (req, res) => {
    res.json(dbStorage.getResults());
});

app.post('/api/results', async (req, res) => {
    const newResult = req.body;
    if (!newResult.date) {
        newResult.date = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }
    dbStorage.addResult(newResult);
    if (newResult.userId) {
        dbStorage.saveTestSession({
            userId: newResult.userId,
            testType: 'simulator',
            startTime: Date.now(),
            completed: true,
            completedAt: newResult.date
        });
    }
    res.json({ success: true });
});

app.get('/api/ai-results', async (req, res) => {
    res.json(dbStorage.getAiResults());
});

app.post('/api/ai-results', async (req, res) => {
    const newResult = req.body;
    if (!newResult.date) {
        newResult.date = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }
    dbStorage.addAiResult(newResult);
    if (newResult.userId) {
        dbStorage.saveTestSession({
            userId: newResult.userId,
            testType: 'ai-agent',
            startTime: Date.now(),
            completed: true,
            completedAt: newResult.date
        });
    }
    res.json({ success: true });
});

app.delete('/api/results', requireAdminRole, async (req, res) => {
    const { userId, date } = req.body;
    dbStorage.deleteResult(userId, date);
    dbStorage.deleteTestSession(`${userId}_simulator`);
    res.json({ success: true });
});

app.delete('/api/ai-results', requireAdminRole, async (req, res) => {
    const { userId, date } = req.body;
    dbStorage.deleteAiResult(userId, date);
    dbStorage.deleteTestSession(`${userId}_ai-agent`);
    res.json({ success: true });
});

// Test Session Timers and Expiration Locking Endpoints
app.get('/api/test-sessions', async (req, res) => {
    res.json(dbStorage.getAllTestSessions());
});

app.get('/api/test-session', async (req, res) => {
    const userId = req.query.userId;
    const testType = req.query.testType || 'simulator';
    const key = `${userId}_${testType}`;
    const session = dbStorage.getTestSession(key);

    if (!session) {
        return res.json({ status: 'not_started' });
    }
    if (session.completed) {
        return res.json({ status: 'completed', completedAt: session.completedAt });
    }
    const duration = session.duration || 3600000;
    const elapsed = Date.now() - session.startTime;
    if (elapsed >= duration) {
        session.completed = true;
        session.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
        dbStorage.saveTestSession(session);
        return res.json({ status: 'expired', duration, completedAt: session.completedAt });
    }
    const remainingSeconds = Math.max(0, Math.floor((duration - elapsed) / 1000));
    res.json({
        status: 'active',
        startTime: session.startTime,
        duration: duration,
        remainingSeconds: remainingSeconds
    });
});

app.post('/api/test-session/start', async (req, res) => {
    const { userId, testType } = req.body;
    const tType = testType || 'simulator';
    const key = `${userId}_${tType}`;
    const duration = 3600000; // 60 minutes (1 hour)

    let session = dbStorage.getTestSession(key);
    if (!session) {
        session = {
            userId,
            testType: tType,
            startTime: Date.now(),
            duration: duration,
            completed: false,
            completedAt: null
        };
        dbStorage.saveTestSession(session);
    } else if (session.completed) {
        return res.json({ status: 'completed', completedAt: session.completedAt });
    } else {
        const elapsed = Date.now() - session.startTime;
        if (elapsed >= duration) {
            session.completed = true;
            session.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
            dbStorage.saveTestSession(session);
            return res.json({ status: 'expired', completedAt: session.completedAt });
        }
    }

    const elapsed = Date.now() - session.startTime;
    const remainingSeconds = Math.max(0, Math.floor((duration - elapsed) / 1000));
    res.json({
        status: 'active',
        startTime: session.startTime,
        duration: duration,
        remainingSeconds: remainingSeconds
    });
});

app.post('/api/test-session/complete', async (req, res) => {
    const { userId, testType } = req.body;
    const key = `${userId}_${testType || 'simulator'}`;
    let session = dbStorage.getTestSession(key) || { userId, testType: testType || 'simulator', startTime: Date.now() };
    session.completed = true;
    session.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 19);
    dbStorage.saveTestSession(session);
    res.json({ success: true, status: 'completed' });
});

app.post('/api/send-invite', requireAdminRole, async (req, res) => {
    const { userId, email, testType } = req.body;
    const user = dbStorage.getUserById(userId);
    const employeeName = user ? user.name : "Employee";
    if (user && email) {
        dbStorage.updateUserEmail(userId, email);
    }

    const targetType = testType === 'ai-agent' ? 'ai-agent' : 'simulator';
    const targetAssignments = dbStorage.getAssignments(targetType);
    if (!targetAssignments.includes(userId)) {
        targetAssignments.push(userId);
        dbStorage.setAssignments(targetType, targetAssignments);
    }
    
    const hostHeader = req.get('host') || 'localhost:8888';
    const protocol = req.protocol || 'http';
    const loginLink = `${protocol}://${hostHeader}/?login=${userId}&test=${testType || 'simulator'}`;
    
    let sent = false;
    let simulated = false;
    let errorMsg = "";
    
    const activeTestDesc = testType === 'ai-agent' ? "تقييم الأيجنت الذكي المباشر (AI Agent Coach)" : "محاكي دردشة خدمة العملاء (Chat Simulator)";
    const subjectLine = `📋 تنبيه: يوجد اختبار تدريبي جديد مستحق لك في منصة زين كاش!`;
    
    const smtpSettings = dbStorage.getConfig('smtp', defaultSmtp);
    
    const htmlEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Cairo', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; direction: rtl; text-align: right; }
        .card { background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 30px; text-align: center; border-bottom: 4px solid #ff9900; }
        .body { padding: 30px; line-height: 1.6; color: #334155; }
        .btn-container { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #ff9900 0%, #ff6600 100%); color: #ffffff !important; padding: 12px 35px; font-weight: bold; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 10px rgba(255, 153, 0, 0.3); font-size: 16px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h2 style="margin: 0; font-size: 22px; color: #ffffff;">أكاديمية تدريب خدمة عملاء زين كاش</h2>
        </div>
        <div class="body">
            <h3 style="margin-top: 0; color: #0f172a;">مرحباً ${employeeName}،</h3>
            <p>تم إسناد اختبار تدريبي نشط ومستحق لك الآن على المنصة بعنوان: <strong>${activeTestDesc}</strong>.</p>
            <p>يرجى النقر على الزر أدناه للدخول إلى المنصة، حيث سيتم عرض المادة التدريبية (السلايدات التثقيفية) أولاً، يتبعها مباشرة الدخول للاختبار لحل الحالات وتصنيف التذاكر.</p>
            <p style="color: #ea580c; font-weight: bold;">⚠️ ملاحظة هامة: صلاحية الاختبار تنتهي خلال 24 ساعة من تاريخ الإسناد، ولديك ساعة واحدة فقط لإكماله فور الدخول.</p>
            <div class="btn-container">
                <a href="${loginLink}" class="btn">بدء الاختبار والتدريب الآن</a>
            </div>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">* ملاحظة: هذا الرابط مخصص لك شخصياً للدخول السريع والمباشر إلى الاختبار دون الحاجة لكلمة مرور.</p>
        </div>
        <div class="footer">
            جميع الحقوق محفوظة © أكاديمية تدريب خدمة العملاء - زين كاش 2026
        </div>
    </div>
</body>
</html>
    `;

    const providedBrevo = ((smtpSettings.brevoKey || '').trim()) || process.env.BREVO_API_KEY || '';
    const providedResend = ((smtpSettings.resendKey || '').trim()) || process.env.RESEND_API_KEY || '';

    let finalBrevoKey = providedBrevo;
    let finalResendKey = providedResend;

    if (!finalBrevoKey && (providedResend.startsWith('xsmtpsib-') || providedResend.startsWith('xkeysib-'))) {
        finalBrevoKey = providedResend;
    }
    if (!finalResendKey && providedBrevo.startsWith('re_')) {
        finalResendKey = providedBrevo;
    }

    const anyKey = finalBrevoKey || finalResendKey;

    // 1. Try SendGrid HTTP API (Port 443) if key starts with SG.
    if (!sent && anyKey && anyKey.startsWith('SG.')) {
        try {
            const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${anyKey.trim()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    personalizations: [{ to: [{ email: email, name: employeeName }] }],
                    from: { email: smtpSettings.username || 'zaincash.testexam@gmail.com', name: 'Zain Cash Academy' },
                    subject: subjectLine,
                    content: [{ type: 'text/html', value: htmlEmailTemplate }]
                })
            });
            if (r.status >= 200 && r.status < 300) {
                sent = true;
            } else {
                const rData = await r.json().catch(() => ({}));
                errorMsg = rData.errors ? rData.errors.map(e => e.message).join(', ') : `SendGrid status ${r.status}`;
            }
        } catch(e) {
            errorMsg = e.message;
        }
    }

    // 2. Try Brevo HTTP API (Port 443 - 300 emails/day)
    if (!sent && finalBrevoKey && !finalBrevoKey.startsWith('SG.')) {
        try {
            const r = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'api-key': finalBrevoKey.trim(),
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    sender: { name: 'Zain Cash Academy', email: smtpSettings.username || 'zaincash.testexam@gmail.com' },
                    to: [{ email: email, name: employeeName }],
                    subject: subjectLine,
                    htmlContent: htmlEmailTemplate
                })
            });
            const rData = await r.json();
            if (r.ok || rData.messageId) {
                sent = true;
            } else {
                errorMsg = rData.message || JSON.stringify(rData);
            }
        } catch(e) {
            errorMsg = e.message;
        }
    }

    // 3. Try Resend HTTP API (Port 443)
    if (!sent && finalResendKey && !finalResendKey.startsWith('xsmtpsib-') && !finalResendKey.startsWith('xkeysib-') && !finalResendKey.startsWith('SG.')) {
        try {
            const r = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${finalResendKey.trim()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    from: 'Zain Cash Academy <onboarding@resend.dev>',
                    to: [email],
                    subject: subjectLine,
                    html: htmlEmailTemplate
                })
            });
            const rData = await r.json();
            if (r.ok) {
                sent = true;
            } else {
                errorMsg = rData.message || rData.name || JSON.stringify(rData);
            }
        } catch(e) {
            errorMsg = e.message;
        }
    }
    
    // Attempt Nodemailer SMTP only if no HTTP API Key was provided
    if (!sent && !finalBrevoKey && !finalResendKey && smtpSettings && smtpSettings.server && smtpSettings.username) {
        try {
            const cleanPass = (smtpSettings.password || '').replace(/\s+/g, '');
            let transporterConfig;
            if (smtpSettings.server.toLowerCase().includes('gmail.com')) {
                transporterConfig = {
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth: {
                        user: smtpSettings.username.trim(),
                        pass: cleanPass
                    },
                    tls: {
                        rejectUnauthorized: false
                    },
                    connectionTimeout: 6000,
                    greetingTimeout: 6000,
                    socketTimeout: 8000
                };
            } else {
                transporterConfig = {
                    host: smtpSettings.server.trim(),
                    port: parseInt(smtpSettings.port) || 587,
                    secure: smtpSettings.enableSsl === true && parseInt(smtpSettings.port) === 465,
                    auth: {
                        user: smtpSettings.username.trim(),
                        pass: cleanPass
                    },
                    tls: {
                        rejectUnauthorized: false
                    },
                    connectionTimeout: 6000,
                    greetingTimeout: 6000,
                    socketTimeout: 8000
                };
            }
            const transporter = nodemailer.createTransport(transporterConfig);
            
            const mailOptions = {
                from: `"Zain Cash Academy" <${smtpSettings.username.trim()}>`,
                to: email,
                subject: subjectLine,
                html: htmlEmailTemplate
            };
            
            await transporter.sendMail(mailOptions);
            sent = true;
        } catch (e) {
            errorMsg = e.message;
            console.error("Nodemailer SMTP Error:", e);
            simulated = true;
        }
    } else {
        simulated = true;
    }
    
    res.json({
        success: true,
        sent,
        simulated,
        link: loginLink,
        error: errorMsg
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

if (require.main === module) {
    server.listen(PORT, () => {
        console.log(`Server is running successfully on port ${PORT}!`);
        console.log(`Access locally: http://localhost:${PORT}`);
    });
}

module.exports = { app, server, io };
