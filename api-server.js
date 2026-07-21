// ZainCash API Server - Node.js (proper UTF-8 handling)
// Runs on port 9999 - called by start-server.ps1
const http = require('http');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, 'db.json');

function getDb() {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}
function saveDb(db) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

const server = http.createServer((req, res) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,X-User-Role,X-User-Id');

    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
        try {
            const url = req.url;
            const db = getDb();

            if (url === '/api/slides' && req.method === 'GET') {
                res.end(JSON.stringify(db.slides || []));
            } else if (url === '/api/slides' && req.method === 'POST') {
                db.slides = JSON.parse(body);
                saveDb(db);
                res.end('{"success":true}');

            } else if (url === '/api/kb' && req.method === 'GET') {
                res.end(JSON.stringify(db.knowledgeBase || []));
            } else if (url === '/api/kb' && req.method === 'POST') {
                db.knowledgeBase = JSON.parse(body);
                saveDb(db);
                res.end('{"success":true}');

            } else if (url === '/api/scenarios' && req.method === 'GET') {
                res.end(JSON.stringify(db.scenarios || []));
            } else if (url === '/api/scenarios' && req.method === 'POST') {
                db.scenarios = JSON.parse(body);
                saveDb(db);
                res.end('{"success":true}');

            } else if (url === '/api/users' && req.method === 'GET') {
                res.end(JSON.stringify(db.users || []));

            } else if (url === '/api/assignments' && req.method === 'GET') {
                res.end(JSON.stringify(db.assignments || []));
            } else if (url === '/api/assignments' && req.method === 'POST') {
                db.assignments = JSON.parse(body);
                saveDb(db);
                res.end('{"success":true}');

            } else if (url === '/api/results' && req.method === 'GET') {
                res.end(JSON.stringify(db.results || []));
            } else if (url === '/api/results' && req.method === 'POST') {
                const r = JSON.parse(body);
                r.date = new Date().toISOString().replace('T', ' ').substring(0, 19);
                db.results = db.results || [];
                db.results.push(r);
                saveDb(db);
                res.end('{"success":true}');

            } else if (url === '/api/ai-results' && req.method === 'GET') {
                res.end(JSON.stringify(db.aiResults || []));
            } else if (url === '/api/ai-results' && req.method === 'POST') {
                const r = JSON.parse(body);
                r.date = new Date().toISOString().replace('T', ' ').substring(0, 19);
                db.aiResults = db.aiResults || [];
                db.aiResults.push(r);
                saveDb(db);
                res.end('{"success":true}');

            } else if (url === '/api/login' && req.method === 'POST') {
                const b = JSON.parse(body);
                const code = (b.username || '').trim().toUpperCase();
                const user = (db.users || []).find(u => u.id && u.id.toUpperCase() === code);
                if (user) {
                    res.end(JSON.stringify({ id: user.id, name: user.name, email: user.email || '', role: user.role }));
                } else {
                    res.writeHead(401);
                    res.end('{"error":"ZC code not registered. Access denied."}');
                }

            } else if (url === '/api/smtp' && req.method === 'GET') {
                res.end(JSON.stringify(db.smtp || { server: '', port: 587, enableSsl: true, username: '', password: '' }));
            } else if (url === '/api/smtp' && req.method === 'POST') {
                db.smtp = JSON.parse(body);
                saveDb(db);
                res.end('{"success":true}');

            } else if (url === '/api/users/update-email' && req.method === 'POST') {
                const upd = JSON.parse(body);
                const u = (db.users || []).find(x => x.id === upd.id);
                if (u) { u.email = upd.email; saveDb(db); res.end('{"success":true}'); }
                else { res.writeHead(404); res.end('{"error":"Not found"}'); }

            } else if (url === '/api/send-invite' && req.method === 'POST') {
                // Email sending not supported in node mini-server; simulate success
                res.end('{"success":true,"simulated":true,"sent":false,"link":""}');

            } else {
                res.writeHead(404);
                res.end('{"error":"Not found"}');
            }
        } catch (e) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: e.message }));
        }
    });
});

server.listen(9999, '127.0.0.1', () => {
    console.log('[ZainCash API] Node.js API server running on http://127.0.0.1:9999');
});
