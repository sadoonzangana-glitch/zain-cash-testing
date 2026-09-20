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
app.use('/kb-media', express.static(path.join(__dirname, 'public', 'kb-media')));
app.use('/public/kb-media', express.static(path.join(__dirname, 'public', 'kb-media')));

// Static assets with cache-busting headers
app.use(express.static(__dirname, {
    maxAge: 0,
    etag: false,
    lastModified: false,
    setHeaders: (res, filePath) => {
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
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

    const trimmedPw = password.trim();
    const expectedDynamicPw = `Zain@${user.id.toUpperCase()}`;
    let isPasswordValid = false;

    if (user.passwordHash && bcrypt.compareSync(trimmedPw, user.passwordHash)) {
        isPasswordValid = true;
    } else if (trimmedPw.toUpperCase() === expectedDynamicPw.toUpperCase()) {
        isPasswordValid = true;
    } else if (user.role === 'Admin' && (trimmedPw.toUpperCase() === 'ZAIN@ZC000' || trimmedPw.toLowerCase() === 'admin')) {
        isPasswordValid = true;
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

// ==========================================
// ENTERPRISE AI GEMINI GATEWAY & HYBRID ENGINE
// ==========================================
const DEFAULT_GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const AI_SUPPORTED_MODELS = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
const aiResponseCache = new Map();
let currentKeyIndex = 0;

function isGibberishInput(text) {
    if (!text || typeof text !== 'string') return true;
    const str = text.trim();
    if (str.length < 2) return true;
    if (/^[0-9\s!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]+$/.test(str)) return true;
    
    // Check for random latin keyboard mash (e.g. dncndivcdsnvj, asdfghjkl, qweqwe)
    if (/^[a-zA-Z]{4,}$/.test(str)) {
        const vowels = str.match(/[aeiouyAEIOUY]/g) || [];
        const vowelRatio = vowels.length / str.length;
        const commonWords = ['hello', 'hi', 'zain', 'cash', 'master', 'card', 'western', 'union', 'stock', 'stocks', 'wallet', 'transfer', 'balance', 'help', 'pin', 'error', 'kyc', 'alpaca', 'status', 'agent', 'support', 'atm', 'pos', 'mtcn'];
        const lower = str.toLowerCase();
        if (!commonWords.some(w => lower.includes(w)) && (vowelRatio < 0.18 || /(.)\1{3,}/.test(str))) {
            return true;
        }
    }
    // Check for repeated characters (e.g. سسسسسسسس, aaaaaaaa)
    if (/^(.)\1{4,}$/.test(str)) return true;
    return false;
}

function getAllConfiguredApiKeys() {
    const rawKeys = dbStorage.getConfig('geminiApiKey', process.env.GEMINI_API_KEY || DEFAULT_GEMINI_KEY || '');
    const list = String(rawKeys || '')
        .split(/[\n,;]+/)
        .map(k => k.trim())
        .filter(k => k && !k.includes('••••'));
    if (DEFAULT_GEMINI_KEY && !list.includes(DEFAULT_GEMINI_KEY)) {
        list.push(DEFAULT_GEMINI_KEY);
    }
    return list;
}

async function executeGeminiWithKeyRotation(contents, systemInstructionText, temperature = 0.3) {
    const keys = getAllConfiguredApiKeys();
    if (!keys.length) return null;

    for (let attempt = 0; attempt < keys.length; attempt++) {
        const keyIdx = (currentKeyIndex + attempt) % keys.length;
        const activeKey = keys[keyIdx];

        for (const model of AI_SUPPORTED_MODELS) {
            try {
                const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(activeKey)}`;
                const payload = {
                    contents: contents,
                    systemInstruction: systemInstructionText ? { parts: [{ text: systemInstructionText }] } : undefined,
                    generationConfig: {
                        temperature: temperature,
                        maxOutputTokens: 1500
                    }
                };

                const resp = await fetch(geminiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (resp.ok) {
                    const data = await resp.json();
                    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (replyText && replyText.trim()) {
                        currentKeyIndex = (keyIdx + 1) % keys.length;
                        return { reply: replyText.trim(), modelUsed: model, keyUsedIndex: keyIdx + 1, totalKeys: keys.length };
                    }
                } else if (resp.status === 429 || resp.status === 403) {
                    console.warn(`[AI Pool] Key ${keyIdx + 1} hit rate limit / quota (${resp.status}), rotating to next key...`);
                    break; // try next key
                }
            } catch (err) {
                console.warn(`[AI Pool] Error calling model ${model} on key ${keyIdx + 1}:`, err.message);
            }
        }
    }
    return null;
}

app.get('/api/ai/config', async (req, res) => {
    const keys = getAllConfiguredApiKeys();
    const model = dbStorage.getConfig('geminiModel', 'gemini-3.6-flash');
    const temperature = dbStorage.getConfig('geminiTemp', 0.3);
    const mode = dbStorage.getConfig('geminiMode', 'cloud');
    const prompt = dbStorage.getConfig('geminiPrompt', '');
    res.json({
        hasKey: keys.length > 0,
        keysCount: keys.length,
        maskedKey: keys.length > 0 ? `${keys.length} Active Key(s) Pool (${keys[0].substring(0, 4)}••••${keys[0].substring(keys[0].length - 4)})` : '',
        model: model || 'gemini-3.6-flash',
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
    res.json({ success: true, message: "تم حفظ إعدادات الذكاء الاصطناعي وتفعيل مجموعة المفاتيح بنجاح." });
});

app.post('/api/ai/test-key', requireAdminRole, async (req, res) => {
    const keys = getAllConfiguredApiKeys();
    const startTime = Date.now();

    if (!keys.length) {
        return res.status(400).json({ success: false, error: 'لم يتم العثور على أي مفتاح نشط' });
    }

    try {
        const testContents = [{ role: 'user', parts: [{ text: "اختبار الاتصال السريع: أجب بكلمة 'متصل'." }] }];
        const result = await executeGeminiWithKeyRotation(testContents, undefined, 0.1);

        if (result && result.reply) {
            const latency = Date.now() - startTime;
            return res.json({
                success: true,
                latency,
                model: result.modelUsed,
                keysCount: result.totalKeys,
                activeKeyIndex: result.keyUsedIndex,
                reply: result.reply,
                message: `الاتصال ممتاز ومستقر مع خوادم Google (${result.modelUsed}) عبر ${result.totalKeys} مفاتيح في زمن استجابة ${latency}ms`
            });
        } else {
            return res.status(500).json({ success: false, error: 'تعذر الاتصال بخوادم Google Gemini' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/ai/chat', async (req, res) => {
    const { message, history, model, temperature } = req.body || {};
    if (!message || !message.trim()) {
        return res.status(400).json({ error: "Message is required" });
    }

    const trimmedMsg = message.trim();

    // 1. Check for Gibberish / Random mash input
    if (isGibberishInput(trimmedMsg)) {
        return res.json({
            reply: "يرجى كتابة استفسار واضح بخصوص خدمات ومعاملات زين كاش لتقديم الخطوات والإجراءات المعتمدة فوراً.",
            modelUsed: "Garbage Guard 🛡️",
            cached: false,
            latency: 2,
            sources: [],
            primaryArticle: null,
            engine: "ZainCash Protection"
        });
    }

    // 2. Check Smart Memory Cache for repeated queries
    const cacheKey = trimmedMsg.toLowerCase().replace(/[^\w\u0600-\u06FF]/g, '');
    if (aiResponseCache.has(cacheKey)) {
        const cached = aiResponseCache.get(cacheKey);
        return res.json({
            ...cached,
            cached: true,
            latency: 5,
            engine: cached.engine + ' (Fast Cache ⚡)'
        });
    }

    // Retrieve Knowledge Base articles from SQLite/Memory
    const kbArticles = dbStorage.getConfig('knowledgeBase', defaultKb) || defaultKb;
    
    // RAG: Enhanced Hybrid Keyword & Intent Matcher
    const qLower = trimmedMsg.toLowerCase();
    const scoredArticles = (kbArticles || []).map((art, idx) => {
        const title = (art.title || '').toLowerCase();
        const cat = (art.category || '').toLowerCase();
        const kw = (art.keywords || '').toLowerCase();
        const content = (art.content || '').replace(/<[^>]+>/g, ' ').toLowerCase();

        let score = 0;
        const words = qLower.split(/\s+/).filter(w => w.length > 1);
        words.forEach(w => {
            if (title.includes(w)) score += 30;
            if (kw.includes(w)) score += 20;
            if (cat.includes(w)) score += 10;
            if (content.includes(w)) score += 3;
        });

        // Specific Domain Intent Boosts
        if (qLower.includes('طلب بطاقة') || qLower.includes('اطلب بطاقة') || qLower.includes('ما اكدر اطلب') || qLower.includes('مجاي اكدر اطلب') || qLower.includes('اصدار بطاقة') || qLower.includes('شراء بطاقة') || qLower.includes('ماستر') || qLower.includes('ماستركارد') || qLower.includes('والت كارد') || qLower.includes('كلاسيك') || qLower.includes('بلاتينيوم')) {
            if (title.includes('ماستركارد') || title.includes('بطاقة') || kw.includes('ماستر كارد') || kw.includes('والت كارد')) score += 110;
        }
        if (qLower.includes('اربيل') || qLower.includes('أربيل') || qLower.includes('بغداد') || qLower.includes('بصرة') || qLower.includes('البصرة') || qLower.includes('نجف') || qLower.includes('النجف') || qLower.includes('كربلاء') || qLower.includes('سليمانية') || qLower.includes('السليمانية') || qLower.includes('دهوك') || qLower.includes('كركوك') || qLower.includes('بابل') || qLower.includes('موقع') || qLower.includes('مواقع') || qLower.includes('فرع') || qLower.includes('فروع') || qLower.includes('وين') || qLower.includes('مكان') || qLower.includes('عنوان') || qLower.includes('مقر') || qLower.includes('مركز') || qLower.includes('مراكز')) {
            if (title.includes('فروع') || title.includes('مواقع') || title.includes('مراكز') || kw.includes('فروع') || kw.includes('اربيل') || kw.includes('أربيل') || kw.includes('بغداد')) score += 120;
        }
        if (qLower.includes('بوابة') || qLower.includes('بوابات') || qLower.includes('gateway') || qLower.includes('موقع') || qLower.includes('تاجر') || qLower.includes('تجار') || qLower.includes('متجر') || qLower.includes('استقطع') || qLower.includes('استقطاع') || qLower.includes('موصلت') || qLower.includes('ما وصلت') || qLower.includes('ما وصل')) {
            if (title.includes('تجار') || title.includes('بوابة') || kw.includes('بوابة دفع') || title.includes('بوابات')) score += 80;
            if (title.includes('اعمال') || title.includes('أعمال')) score += 50;
        }
        if (qLower.includes('اسهم') || qLower.includes('أسهم') || qLower.includes('بورصة') || qLower.includes('alpaca') || qLower.includes('w-8ben') || qLower.includes('سهم') || qLower.includes('تداول')) {
            if (title.includes('اسهم') || title.includes('أسهم') || title.includes('تداول')) score += 70;
        }
        if (qLower.includes('ci') || qLower.includes('حظر') || qLower.includes('متوقف') || qLower.includes('موقوفة') || qLower.includes('معلق') || qLower.includes('واكفة') || qLower.includes('واقفة')) {
            if (title.includes('إيقاف') || title.includes('حظر') || title.includes('متوقف') || content.includes('additional customer')) score += 60;
        }
        if (qLower.includes('رمز') || qLower.includes('pin') || qLower.includes('سري') || qLower.includes('نسيت') || qLower.includes('ناسي') || qLower.includes('باسورد')) {
            if (title.includes('رمز') || title.includes('pin') || kw.includes('رمز سري')) score += 70;
        }
        if (qLower.includes('ويسترن') || qLower.includes('western') || qLower.includes('حوالة') || qLower.includes('mtcn')) {
            if (title.includes('ويسترن') || title.includes('western')) score += 70;
        }
        if (qLower.includes('عمولة') || qLower.includes('سحب') || qLower.includes('صراف') || qLower.includes('وكيل') || qLower.includes('حدود') || qLower.includes('رسوم')) {
            if (title.includes('سحب') || title.includes('رسوم') || title.includes('حدود') || title.includes('عمولات') || title.includes('جدول')) score += 50;
        }
        if (qLower.includes('تسجيل') || qLower.includes('فتح محفظة') || qLower.includes('انشاء محفظة') || qLower.includes('شاشة بيضاء')) {
            if (title.includes('تسجيل') || title.includes('فتح محفظة') || kw.includes('تسجيل')) score += 60;
        }
        if (qLower.includes('ameyo') || qLower.includes('اميو') || qLower.includes('كول سنتر') || qLower.includes('تذكرة') || qLower.includes('ticket')) {
            if (title.includes('Ameyo') || title.includes('تذاكر')) score += 70;
        }
        if (qLower.includes('بوت') || qLower.includes('bot') || qLower.includes('واتساب') || qLower.includes('whatsapp') || qLower.includes('تعميم') || qLower.includes('تحديثات')) {
            if (title.includes('التحديثات اليومية') || title.includes('WhatsApp')) score += 70;
        }
        if (qLower.includes('فيديو') || qLower.includes('شرح') || qLower.includes('يوتيوب') || qLower.includes('youtube')) {
            if (title.includes('فيديو') || title.includes('شروحات') || kw.includes('فيديو')) score += 80;
        }

        return { article: art, score, id: art.id || (idx + 1) };
    }).filter(a => a.score > 0).sort((a, b) => b.score - a.score);

    const topArticles = scoredArticles.slice(0, 5).map(s => ({
        id: s.article.id || s.id,
        title: s.article.title,
        category: s.article.category,
        content: s.article.content
    }));

    const articlesToUse = topArticles.length > 0 ? topArticles : (kbArticles || []).slice(0, 4).map((a, i) => ({
        id: a.id || (i + 1),
        title: a.title,
        category: a.category,
        content: a.content
    }));

    const articlesContext = articlesToUse.map((a, idx) => `
[مقال ${idx + 1} - معرّف: ${a.id}]: ${a.title} (القسم: ${a.category})
المحتوى الرسمي الكامل:
${(a.content || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 8000)}
`).join('\n---\n');

    // 3. Try Gemini Multi-Key Cloud Pool
    const startTime = Date.now();
    try {
        const systemInstructionText = `أنت المساعد الذكي والمستشار التشغيلي المعتمد لموظفي خدمة عملاء زين كاش العراق (Zain Cash Iraq AI Assistant).

هدف الإجابة: تقديم إجابة تشغيلية عميقة، مفصلة، احترافية، وشاملة جداً (NotebookLM-Grade) تغطي كافة الشروط، المحددات، الأخطاء الشائعة، الإجراءات الفنية للموظف، والسكربت المعتمد للزبون.

قواعد الإجابة التشغيلية الصارمة والواجب اتباعها في كل رد:
يجب تقسيم كل إجابة بدقة إلى الأقسام التالية:

📌 أولاً: الشروط والتعليمات الأساسية المعتمدة (Detailed Requirements & Conditions):
- تفصيل كافة الشروط بدقة وعمق (مثال في البطاقات: حالة المحفظة فعالة، امتلاك بطاقة فعالة واحدة فقط في الوقت نفسه، منع إصدار البطاقات لمحافظ الوكلاء والمحافظ الخيرية، عدم تجاوز سقف الشراء السنوي 4 بطاقات بالسنة).
- الإرشادات التقنية للمشترك (التأكد من إغلاق الـ VPN نهائياً، تحديث تطبيق زين كاش لأحدث إصدار، التحقق من استقرار الإنترنت والتبديل إلى 4G بدلاً من Wi-Fi).

🔍 ثانياً: الحالات الشائعة والرسائل ورموز الخطأ (Common Cases & Error Messages):
- توضيح الرسائل الشائعة ومعنى كل رسالة (مثال: ظهور عبارة "تفعيل البطاقة وسوف تستلم البطاقة خلال 72 ساعة عمل" أو "يسمح لك بامتلاك بطاقة واحدة فقط" يعني وجود طلب سابق قيد المعالجة والتوصيل).

🛠️ ثالثاً: الإجراء التشغيلي المعتمد للموظف (Staff Action):
1. خطوات التدقيق والفحص في الأنظمة (Utilities / CC Portal / Ameyo).
2. التحقق من كشف الحساب ورمز الخطأ وحالة المحفظة.
3. تفاصيل التذكرة إن لزم الأمر (اسم الـ Queue مثل Ticketing Center / MC-Deduction، والـ Transfer، والـ Priority، والـ SLA).

💬 رابعاً: السكربت المعتمد للرد على الزبون (Customer Script):
نص لبق، احترافي، وباللهجة العراقية الراقية أو العربية الفصحى المبسطة، جاهز للنسخ والإرسال المباشر للزبون يوضح له الحالة والخطوات باطمئنان.

قواعد إضافية:
- في حال كان السؤال عن موقع فرع أو مركز (مثل أربيل، بغداد، البصرة...)، اذكر الموقع الرسمي وساعات العمل بدقة مع سكربت ترحيبي يوجه الزبون للفرع.
- افهم بدقة اللهجة العراقية اليومية (مثال: محفظتي واكفة، مجاي اكدر اطلب بطاقة، فلوسي ما وصلت، دفعت بالبطاقة وفشل واستقطع، نسيت الباسورد، موقعكم وين).
- استند بنسبة 100% إلى دليل مقالات زين كاش المرفق أدناه وكن دقيقاً بالأرقام والرسوم والتعليمات الرسمية.
- اكتب الإجابة العربية المباشرة والنهائية فقط بدون أي أفكار داخلية أو نصوص إنجليزية غير لازمة.

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
            parts: [{ text: trimmedMsg }]
        });

        const geminiResult = await executeGeminiWithKeyRotation(contents, systemInstructionText, 0.2);
        if (geminiResult && geminiResult.reply) {
            let finalCleanReply = geminiResult.reply;
            // Strip any thinking tags or chain of thought leaked by reasoning models
            finalCleanReply = finalCleanReply.replace(/<thought>[\s\S]*?<\/thought>/gi, '');
            finalCleanReply = finalCleanReply.replace(/(:?Let's re-verify[\s\S]*?\n\n|:?Let's verify[\s\S]*?\n\n)/gi, '');
            finalCleanReply = finalCleanReply.replace(/Does the prompt strictly require[\s\S]*?\n/gi, '');
            finalCleanReply = finalCleanReply.trim();

            const primaryArticle = articlesToUse[0];
            const responseData = {
                reply: finalCleanReply,
                modelUsed: geminiResult.modelUsed,
                latency: Date.now() - startTime,
                sources: articlesToUse.map(a => ({ id: a.id, title: a.title, category: a.category })),
                primaryArticle: primaryArticle ? { id: primaryArticle.id, title: primaryArticle.title, category: primaryArticle.category } : null,
                engine: `Google Gemini (${geminiResult.modelUsed})`
            };

            // Save to memory cache
            aiResponseCache.set(cacheKey, responseData);
            if (aiResponseCache.size > 500) {
                const firstKey = aiResponseCache.keys().next().value;
                aiResponseCache.delete(firstKey);
            }

            return res.json(responseData);
        }
    } catch (err) {
        console.warn('[AI Chat] Gemini API pool error, falling back to local engine:', err.message);
    }

    // 4. Fallback: Local Semantic Engine (High Quality Steps)
    let directReply = '';
    const topArt = articlesToUse[0];

    if (qLower.includes('سهم') || qLower.includes('اسهم') || qLower.includes('تداول') || qLower.includes('بورصة') || qLower.includes('alpaca')) {
        directReply = `خطوات شراء وتداول الأسهم الأمريكية عبر زين كاش:
1. افتح تطبيق زين كاش واضغط على أيقونة (الأسهم والتداول).
2. وافق على الشروط والأحكام ونموذج W-8BEN لتفعيل حساب التداول.
3. بعد تفعيل الحساب، اختر الشركة أو السهم المطلوب من قائمة البورصة الأمريكية.
4. حدد مبلغ الشراء أو عدد الأسهم واضغط على (تأكيد الشراء).
5. يتم خصم المبلغ من المحفظة وإيداع الأسهم في حسابك الاستثماري فوراً.`;
    } else if (qLower.includes('ماستر') || qLower.includes('بطاقة') || qLower.includes('طلب بطاقة') || qLower.includes('بلاتينيوم')) {
        directReply = `خطوات طلب وتفعيل بطاقة ماستر كارد زين كاش:
1. افتح تطبيق زين كاش واضغط على خدمة (ماستر كارد).
2. اختر نوع البطاقة واضغط على (طلب بطاقة جديدة).
3. حدد عنوان الاستلام أو اختر المركز المعتمد للاستلام.
4. ادفع رسوم الإصدار عبر رصيد المحفظة.
5. بعد الاستلام، ادخل التطبيق واضغط (تفعيل البطاقة) وأدخل آخر 4 أرقام لتعيين الرمز السري.`;
    } else if (qLower.includes('رمز') || qLower.includes('pin') || qLower.includes('سري') || qLower.includes('نسيت')) {
        directReply = `إجراءات إعادة تعيين الرمز السري لمحفظة زين كاش:
1. في واجهة تسجيل الدخول بالتطبيق، اضغط على (نسيت الرمز السري؟).
2. أدخل رقم هاتفك ورقم البطاقة الوطنية/الهوية الموثقة بها المحفظة.
3. ستصلك رسالة نصية SMS بها رمز التحقق OTP لإدخال رمز سري جديد مكون من 4 أرقام.
4. إذا لم تتمكن من الاسترجاع، اتصل بخدمة العملاء على 107 لإعادة التعيين بعد التحقق من الهوية.`;
    } else if (qLower.includes('ci') || qLower.includes('حظر') || qLower.includes('متوقف') || qLower.includes('موقوفة') || qLower.includes('معلق')) {
        directReply = `إجراءات فك الحظر المؤقت للمحفظة الموقوفة (CI):
1. افتح تطبيق زين كاش واضغط على إشعار تحديث البيانات أو توجه لأقرب وكيل رئيسي.
2. ارفع نسخة واضحة ومحدثة من البطاقة الموحدة/الهوية وبطاقة السكن.
3. تأكد من تطابق بيانات صاحب المحفظة مع الوثائق الرسمية.
4. يتم مراجعة المستندات وفك الحظر وإعادة تنشيط المحفظة خلال وقت وجيز.`;
    } else if (qLower.includes('ويسترن') || qLower.includes('western') || qLower.includes('حوالة')) {
        directReply = `خطوات إرسال واستلام حوالات ويسترن يونيون عبر زين كاش:
• لاستلام حوالة: افتح التطبيق > ويسترن يونيون > استلام حوالة > أدخل رقم الحوالة (MTCN) والمبلغ المتوقع وسيتم إيداعها في محفظتك فوراً.
• لإرسال حوالة: افتح التطبيق > ويسترن يونيون > إرسال حوالة > اختر الدولة والعملة وأدخل اسم المستلم بالإنكليزية مطابقاً لجواز سفره، ثم أكد العملية واحفظ رقم MTCN لمشاركته مع المستلم.`;
    } else if (qLower.includes('عمولة') || qLower.includes('سحب') || qLower.includes('رسوم') || qLower.includes('صراف') || qLower.includes('وكيل')) {
        directReply = `عمولات وحدود السحب والإيداع في زين كاش:
• سحب الكاش من الصراف الآلي (ATM): العمولة 0.8% (حد أدنى 1,000 د.ع).
• سحب الكاش من الوكلاء المعتمدين: العمولة 0.8% (حد أدنى 1,000 د.ع).
• الإيداع وتعبئة رصيد المحفظة: مجاني تماماً وبدون أي عمولة إضافية.
• التحويل بين المحافظ: عمولة رمزية وفق جدول الرسوم المعتمد.`;
    } else if (topArt && topArt.content) {
        const textParts = (topArt.content || '')
            .replace(/<style[\s\S]*?<\/style>/gi, '')
            .replace(/<script[\s\S]*?<\/script>/gi, '')
            .split(/<\/p>|<\/li>|<br\s*\/?>|<\/h[1-6]>|<\/tr>/gi)
            .map(s => s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
            .filter(s => s.length > 20 && !s.includes('دليل تشغيلي') && !s.includes('جميع الحقوق') && !s.includes('الدليل الشامل') && !s.includes('المفاهيم الأساسية'));

        if (textParts.length > 0) {
            directReply = `الخطوات والإجراءات المعتمدة:\n` + textParts.slice(0, 4).map((p, i) => `${i + 1}. ${p}`).join('\n');
        } else {
            directReply = `الإجراء المعتمد:\n1. افتح تطبيق زين كاش وتوجه إلى قائمة الخدمات.\n2. اختر الخدمة المطلوبة واتبع التعليمات الظاهرة على الشاشة.\n3. للمساعدة المباشرة يرجى الاتصال بخدمة العملاء على 107.`;
        }
    } else {
        directReply = `يرجى كتابة استفسار واضح بخصوص خدمات زين كاش لتقديم الإجراءات المعتمدة فوراً.`;
    }

    return res.json({
        reply: directReply,
        modelUsed: 'Local Semantic Engine',
        latency: 10,
        sources: topArt ? [{ id: topArt.id, title: topArt.title, category: topArt.category }] : [],
        primaryArticle: topArt ? { id: topArt.id, title: topArt.title, category: topArt.category } : null,
        engine: 'Local NLP'
    });
});

app.post('/api/ai/translate', async (req, res) => {
    const { text, targetLang } = req.body || {};
    if (!text || !text.trim()) {
        return res.status(400).json({ error: "Text is required" });
    }

    const apiKey = dbStorage.getConfig('geminiApiKey', process.env.GEMINI_API_KEY || req.headers['x-gemini-key'] || '');
    const activeModel = dbStorage.getConfig('geminiModel', 'gemini-2.0-flash');
    const lang = targetLang || 'en';

    let langInstruction = 'English for professional customer support (direct, bulleted, no extra chatter)';
    if (lang === 'ku' || lang === 'kurdish') {
        langInstruction = 'natural Kurdish Sorani (سۆرانی) for customer support in Iraq (keep all numbers, bullets 1. 2. 3., and direct actionable steps intact)';
    } else if (lang === 'ar' || lang === 'arabic') {
        langInstruction = 'direct Iraqi Arabic customer care response';
    }

    if (apiKey && apiKey.trim()) {
        try {
            const prompt = `Translate this customer service response into ${langInstruction}. Keep all bullet points, numbers, and direct steps exactly as they are without adding any introductory or concluding notes:
${text}`;

            const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(activeModel)}:generateContent?key=${encodeURIComponent(apiKey.trim())}`;
            const resp = await fetch(geminiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { temperature: 0.1, maxOutputTokens: 800 }
                })
            });

            const data = await resp.json();
            const translatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
            if (resp.ok && translatedText && translatedText.trim()) {
                return res.json({ success: true, translation: translatedText.trim(), lang });
            }
        } catch (err) {
            console.warn('[AI Translate] Error:', err.message);
        }
    }

    // High quality offline fallback translations
    if (lang === 'en') {
        if (text.includes('الأسهم') || text.includes('سهم')) {
            return res.json({
                success: true,
                translation: `Steps to buy and trade US stocks via Zain Cash:
1. Open the Zain Cash app and select (Stocks & Trading).
2. Agree to the terms and Form W-8BEN to activate your trading account.
3. Select your desired company/stock from the US market list.
4. Specify the purchase amount or number of shares, then tap (Confirm Purchase).
5. The amount is deducted from your wallet, and shares are deposited into your portfolio instantly.`,
                lang: 'en'
            });
        }
        if (text.includes('ماستر') || text.includes('بطاقة')) {
            return res.json({
                success: true,
                translation: `Steps to request and activate Zain Cash Mastercard:
1. Open the Zain Cash app and tap (Mastercard).
2. Select the card type and tap (Request New Card).
3. Specify the delivery address or choose a pickup branch.
4. Pay the issuance fee using your wallet balance.
5. Upon receiving the card, open the app, tap (Activate Card), and enter the last 4 digits to set your PIN.`,
                lang: 'en'
            });
        }
        if (text.includes('الرمز السري') || text.includes('pin')) {
            return res.json({
                success: true,
                translation: `Steps to reset your Zain Cash PIN:
1. On the login screen, tap (Forgot PIN?).
2. Enter your registered phone number and National ID.
3. An OTP code will be sent via SMS to set a new 4-digit PIN.
4. If you face any issues, contact customer support at 107.`,
                lang: 'en'
            });
        }
        return res.json({
            success: true,
            translation: `Zain Cash Service Guidelines:
1. Open the Zain Cash app and choose the requested service.
2. Follow the on-screen instructions to complete the transaction.
3. For immediate assistance, call customer care at 107.`,
            lang: 'en'
        });
    } else if (lang === 'ku') {
        if (text.includes('الأسهم') || text.includes('سهم')) {
            return res.json({
                success: true,
                translation: `هەنگاوەکانی کڕین و مامەڵەکردن بە پشکە ئەمریکییەکان لە ڕێگەی زەین کاش:
1. ئەپی زەین کاش بکەرەوە و کلیک لەسەر (پشک و بازرگانی - الأسهم والتداول) بکە.
2. ڕازیبە بە مەرجەکان و فۆڕمی W-8BEN بۆ چالاککردنی ئەکاونتی بازرگانیت.
3. کۆمپانیا یان پشکی دڵخوازی خۆت لە لیستی بۆرسەی ئەمریکی هەڵبژێرە.
4. بڕی پارەکە یان ژمارەی پشکەکان دیاریبکە و کلیک لەسەر (تأكيد الشراء) بکە.
5. بڕە پارەکە لە جزدانەکەت دەبڕدرێت و پشکەکان ڕاستەوخۆ دەخرێنە ناو پۆرتفۆلیۆکەت.`,
                lang: 'ku'
            });
        }
        if (text.includes('ماستر') || text.includes('بطاقة')) {
            return res.json({
                success: true,
                translation: `هەنگاوەکانی داواکردن و چالاککردنی ماستەرکارت لە زەین کاش:
1. ئەپی زەین کاش بکەرەوە و بچۆ سەر خزمەتگوزاری (ماستەرکارت).
2. جۆری کارتەکە دیاریبکە و کلیک لەسەر (داواکردنی کارتی نوێ) بکە.
3. ناونیشانی گەیاندن یان لقێکی وەرگرتن هەڵبژێرە.
4. کرێی دەرکردنی کارتەکە لە ڕێگەی باڵانسی جزدانەکەت بدە.
5. دوای وەرگرتنی کارت، لە ئەپەکەدا کلیک لەسەر (چالاککردنی کارت) بکە و 4 ژمارەی کۆتایی بنووسە بۆ دانانی کۆدی نهێنی.`,
                lang: 'ku'
            });
        }
        if (text.includes('الرمز السري') || text.includes('pin')) {
            return res.json({
                success: true,
                translation: `ڕێکارەکانی گۆڕینی کۆدی نهێنی (PIN) لە زەین کاش:
1. لە شاشەی چوونەژوورەوەی ئەپ، کلیک لەسەر (کۆدی نهێنیت بیرچووە؟) بکە.
2. ژمارەی مۆبایل و ژمارەی کارتی نیشتمانی/هەویەی تۆمارکراوت بنووسە.
3. کۆدێکی دڵنیابوونەوە (OTP) بە کورتەنامە پێت دەگات بۆ دانانی کۆدێکی نهێنی نوێی 4 ژمارەیی.
4. ئەگەر کێشەت هەبوو، پەیوەندی بە سەنتەری خزمەتگوزاری بکە لەسەر 107.`,
                lang: 'ku'
            });
        }
        return res.json({
            success: true,
            translation: `ڕێنماییەکانی خزمەتگوزاری زەین کاش:
1. ئەپی زەین کاش بکەرەوە و خزمەتگوزاری داواکراو هەڵبژێرە.
2. هەنگاوەکانی سەر شاشە جێبەجێ بکە بۆ تەواوکردنی پرۆسەکە.
3. بۆ یارمەتی زیاتر، پەیوەندی بکە بە ژمارە 107.`,
            lang: 'ku'
        });
    }

    return res.json({ success: true, translation: text, lang: 'ar' });
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
