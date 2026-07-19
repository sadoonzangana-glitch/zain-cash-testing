const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 8888;
const dbPath = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

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

async function readDb() {
    try {
        const raw = await fs.readFile(dbPath, 'utf8');
        const clean = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
        return JSON.parse(clean.trim());
    } catch (e) {
        const initial = {
            users: defaultUsers,
            assignments: [],
            results: [],
            scenarios: null,
            aiResults: []
        };
        await fs.writeFile(dbPath, JSON.stringify(initial, null, 4), 'utf8');
        return initial;
    }
}

async function writeDb(db) {
    await fs.writeFile(dbPath, JSON.stringify(db, null, 4), 'utf8');
}

// Routes
app.post('/api/login', async (req, res) => {
    const { username } = req.body;
    if (!username) return res.status(400).json({ error: "Username is required" });
    
    const zcCode = username.trim().toUpperCase();
    const db = await readDb();
    
    const user = db.users.find(u => u.id.toUpperCase() === zcCode || u.name.toUpperCase() === zcCode);
    if (user) {
        res.json(user);
    } else {
        res.status(401).json({ error: "Employee code not registered" });
    }
});

app.get('/api/users', async (req, res) => {
    const db = await readDb();
    res.json(db.users || []);
});

app.post('/api/users/update-email', async (req, res) => {
    const { id, email } = req.body;
    const db = await readDb();
    const user = db.users.find(u => u.id === id);
    if (user) {
        user.email = email;
        await writeDb(db);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: "User not found" });
    }
});

app.get('/api/smtp', async (req, res) => {
    const db = await readDb();
    res.json(db.smtp || { server: "", port: 587, enableSsl: true, username: "", password: "" });
});

app.post('/api/smtp', async (req, res) => {
    const db = await readDb();
    db.smtp = req.body;
    await writeDb(db);
    res.json({ success: true });
});

app.get('/api/scenarios', async (req, res) => {
    const db = await readDb();
    res.json(db.scenarios);
});

app.post('/api/scenarios', async (req, res) => {
    const db = await readDb();
    db.scenarios = req.body;
    await writeDb(db);
    res.json({ success: true });
});

app.get('/api/slides', async (req, res) => {
    const db = await readDb();
    res.json(db.slides);
});

app.post('/api/slides', async (req, res) => {
    const db = await readDb();
    db.slides = req.body;
    await writeDb(db);
    res.json({ success: true });
});

app.get('/api/assignments', async (req, res) => {
    const db = await readDb();
    res.json(db.assignments || []);
});

app.post('/api/assignments', async (req, res) => {
    const db = await readDb();
    db.assignments = req.body;
    await writeDb(db);
    res.json({ success: true });
});

app.get('/api/ai-assignments', async (req, res) => {
    const db = await readDb();
    res.json(db.aiAssignments || []);
});

app.post('/api/ai-assignments', async (req, res) => {
    const db = await readDb();
    db.aiAssignments = req.body;
    await writeDb(db);
    res.json({ success: true });
});

app.get('/api/results', async (req, res) => {
    const db = await readDb();
    res.json(db.results || []);
});

app.post('/api/results', async (req, res) => {
    const db = await readDb();
    const newResult = req.body;
    if (!newResult.date) {
        newResult.date = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }
    db.results = db.results || [];
    db.results.push(newResult);
    await writeDb(db);
    res.json({ success: true });
});

app.get('/api/ai-results', async (req, res) => {
    const db = await readDb();
    res.json(db.aiResults || []);
});

app.post('/api/ai-results', async (req, res) => {
    const db = await readDb();
    const newResult = req.body;
    if (!newResult.date) {
        newResult.date = new Date().toISOString().replace('T', ' ').substring(0, 19);
    }
    db.aiResults = db.aiResults || [];
    db.aiResults.push(newResult);
    await writeDb(db);
    res.json({ success: true });
});

app.post('/api/send-invite', async (req, res) => {
    const { userId, email } = req.body;
    const db = await readDb();
    
    const user = db.users.find(u => u.id === userId);
    const employeeName = user ? user.name : "Employee";
    if (user) {
        user.email = email;
        await writeDb(db);
    }
    
    const hostHeader = req.get('host') || 'localhost:8888';
    const loginLink = `http://${hostHeader}/?login=${userId}`;
    
    let sent = false;
    let simulated = false;
    let errorMsg = "";
    
    if (db.smtp && db.smtp.server && db.smtp.username) {
        try {
            const transporter = nodemailer.createTransport({
                host: db.smtp.server,
                port: parseInt(db.smtp.port) || 587,
                secure: db.smtp.enableSsl === true && db.smtp.port === 465,
                auth: {
                    user: db.smtp.username,
                    pass: db.smtp.password
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
            
            const mailOptions = {
                from: `"Zain Cash Academy" <${db.smtp.username}>`,
                to: email,
                subject: "Invitation to Zain Cash Customer Care Test",
                html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; direction: ltr; }
        .card { background-color: #ffffff; max-width: 600px; margin: 0 auto; border-radius: 16px; border: 1px solid #cbd5e1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); overflow: hidden; }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #ffffff; padding: 30px; text-align: center; border-bottom: 4px solid #ff9900; }
        .body { padding: 30px; line-height: 1.6; color: #334155; text-align: left; }
        .btn-container { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; background: linear-gradient(135deg, #ff9900 0%, #ff6600 100%); color: #ffffff !important; padding: 12px 35px; font-weight: bold; text-decoration: none; border-radius: 10px; box-shadow: 0 4px 10px rgba(255, 153, 0, 0.3); font-size: 16px; }
        .footer { background-color: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="card">
        <div class="header">
            <h2 style="margin: 0; font-size: 22px;">Zain Cash Customer Care Academy</h2>
        </div>
        <div class="body">
            <h3 style="margin-top: 0; color: #0f172a;">Hello ${employeeName},</h3>
            <p>You have been invited to perform a practice evaluation on the **Zain Cash Customer Care Chat Simulator**.</p>
            <p>Please click the button below to start your training and testing session directly. Your performance and results will be automatically saved and reported to the management.</p>
            <div class="btn-container">
                <a href="${loginLink}" class="btn">Start Test Now</a>
            </div>
            <p style="font-size: 13px; color: #64748b; margin-bottom: 0;">* Note: This link is unique to you for quick login to start the test without requiring credentials.</p>
        </div>
        <div class="footer">
            All rights reserved © Zain Cash Customer Care Academy 2026
        </div>
    </div>
</body>
</html>
                `
            };
            
            await transporter.sendMail(mailOptions);
            sent = true;
        } catch (e) {
            errorMsg = e.message;
            console.error("Nodemailer SMTP Error:", e);
        }
    } else {
        simulated = true;
    }
    
    res.json({
        success: !errorMsg,
        sent,
        simulated,
        link: loginLink,
        error: errorMsg
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running successfully on port ${PORT}!`);
    console.log(`Access locally: http://localhost:${PORT}`);
});
