// =========================================================
// database.js — High-Performance SQLite Database Engine (WAL Mode)
// =========================================================
'use strict';

const path = require('path');
const fs = require('fs');
const Database = require('better-sqlite3');

const DB_FILE = path.join(__dirname, 'database.sqlite');
const db = new Database(DB_FILE);

// Enable Write-Ahead Logging (WAL) for maximum concurrency and sub-millisecond latency
db.pragma('journal_mode = WAL');
db.pragma('synchronous = NORMAL');
db.pragma('foreign_keys = ON');

// 1. Initialize Tables
db.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        passwordHash TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'Inbound'
    );

    CREATE TABLE IF NOT EXISTS system_config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS assignments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        test_type TEXT NOT NULL,
        assigned_at INTEGER NOT NULL,
        UNIQUE(user_id, test_type)
    );

    CREATE TABLE IF NOT EXISTS test_sessions (
        session_key TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        test_type TEXT NOT NULL,
        start_time INTEGER NOT NULL,
        duration INTEGER NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        completed_at TEXT
    );

    CREATE TABLE IF NOT EXISTS results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        user_name TEXT,
        test_type TEXT DEFAULT 'simulator',
        date TEXT NOT NULL,
        score REAL DEFAULT 0,
        percentage REAL DEFAULT 0,
        correct_count INTEGER DEFAULT 0,
        wrong_count INTEGER DEFAULT 0,
        total_count INTEGER DEFAULT 0,
        details_json TEXT
    );

    CREATE TABLE IF NOT EXISTS ai_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        user_name TEXT,
        date TEXT NOT NULL,
        score REAL DEFAULT 0,
        percentage REAL DEFAULT 0,
        details_json TEXT
    );

    CREATE TABLE IF NOT EXISTS call_signals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        to_user_id TEXT NOT NULL,
        from_user_id TEXT,
        from_user_name TEXT,
        type TEXT,
        payload_json TEXT NOT NULL,
        timestamp INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_signals_to_time ON call_signals(to_user_id, timestamp);
    CREATE INDEX IF NOT EXISTS idx_results_user_date ON results(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_ai_results_user_date ON ai_results(user_id, date);
    CREATE INDEX IF NOT EXISTS idx_assignments_type ON assignments(test_type);
`);

// 2. Precompiled Statements for High-Speed Execution
const stmts = {
    getAllUsers: db.prepare('SELECT id, name, email, passwordHash, role FROM users'),
    getUserById: db.prepare('SELECT id, name, email, passwordHash, role FROM users WHERE UPPER(id) = UPPER(?)'),
    findUser: db.prepare(`
        SELECT id, name, email, passwordHash, role FROM users 
        WHERE UPPER(id) = UPPER(?) OR UPPER(email) = UPPER(?) OR UPPER(name) = UPPER(?)
    `),
    upsertUser: db.prepare(`
        INSERT INTO users (id, name, email, passwordHash, role)
        VALUES (@id, @name, @email, @passwordHash, @role)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            email = excluded.email,
            passwordHash = excluded.passwordHash,
            role = excluded.role
    `),
    updateUserEmail: db.prepare('UPDATE users SET email = ? WHERE id = ?'),
    
    // System Config
    getConfig: db.prepare('SELECT value FROM system_config WHERE key = ?'),
    setConfig: db.prepare(`
        INSERT INTO system_config (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `),

    // Assignments
    getAssignmentsByType: db.prepare('SELECT user_id FROM assignments WHERE test_type = ?'),
    clearAssignmentsByType: db.prepare('DELETE FROM assignments WHERE test_type = ?'),
    insertAssignment: db.prepare('INSERT OR REPLACE INTO assignments (user_id, test_type, assigned_at) VALUES (?, ?, ?)'),

    // Sessions
    getSession: db.prepare('SELECT session_key, user_id, test_type, start_time, duration, completed, completed_at FROM test_sessions WHERE session_key = ?'),
    getAllSessions: db.prepare('SELECT session_key, user_id, test_type, start_time, duration, completed, completed_at FROM test_sessions'),
    upsertSession: db.prepare(`
        INSERT INTO test_sessions (session_key, user_id, test_type, start_time, duration, completed, completed_at)
        VALUES (@session_key, @user_id, @test_type, @start_time, @duration, @completed, @completed_at)
        ON CONFLICT(session_key) DO UPDATE SET
            user_id = excluded.user_id,
            test_type = excluded.test_type,
            start_time = excluded.start_time,
            duration = excluded.duration,
            completed = excluded.completed,
            completed_at = excluded.completed_at
    `),
    deleteSession: db.prepare('DELETE FROM test_sessions WHERE session_key = ?'),
    deleteSessionsBySuffix: db.prepare('DELETE FROM test_sessions WHERE session_key LIKE ?'),

    // Results
    getAllResults: db.prepare('SELECT * FROM results ORDER BY id DESC'),
    insertResult: db.prepare(`
        INSERT INTO results (user_id, user_name, test_type, date, score, percentage, correct_count, wrong_count, total_count, details_json)
        VALUES (@user_id, @user_name, @test_type, @date, @score, @percentage, @correct_count, @wrong_count, @total_count, @details_json)
    `),
    deleteResult: db.prepare('DELETE FROM results WHERE user_id = ? AND date = ?'),

    // AI Results
    getAllAiResults: db.prepare('SELECT * FROM ai_results ORDER BY id DESC'),
    insertAiResult: db.prepare(`
        INSERT INTO ai_results (user_id, user_name, date, score, percentage, details_json)
        VALUES (@user_id, @user_name, @date, @score, @percentage, @details_json)
    `),
    deleteAiResult: db.prepare('DELETE FROM ai_results WHERE user_id = ? AND date = ?'),

    // Call Signals (Real-time in memory / SQLite buffer)
    insertCallSignal: db.prepare(`
        INSERT INTO call_signals (to_user_id, from_user_id, from_user_name, type, payload_json, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
    `),
    getCallSignals: db.prepare('SELECT * FROM call_signals WHERE to_user_id = ? AND timestamp >= ? ORDER BY id ASC'),
    deleteCallSignalsByUserId: db.prepare('DELETE FROM call_signals WHERE to_user_id = ?'),
    cleanOldSignals: db.prepare('DELETE FROM call_signals WHERE timestamp < ?')
};

// 3. High-Level Helper API

function getUsers(stripSensitive = false) {
    const users = stmts.getAllUsers.all();
    if (stripSensitive) {
        return users.map(({ passwordHash, ...u }) => u);
    }
    return users;
}

function getUserById(id) {
    if (!id) return null;
    return stmts.getUserById.get(id) || null;
}

function findUser(identifier) {
    if (!identifier) return null;
    return stmts.findUser.get(identifier, identifier, identifier) || null;
}

function saveUser(user) {
    if (!user || !user.id) return;
    stmts.upsertUser.run({
        id: user.id,
        name: user.name || user.id,
        email: user.email || '',
        passwordHash: user.passwordHash || '',
        role: user.role || 'Inbound'
    });
}

function updateUserEmail(id, email) {
    return stmts.updateUserEmail.run(email || '', id);
}

function getConfig(key, defaultValue = null) {
    const row = stmts.getConfig.get(key);
    if (!row || !row.value) return defaultValue;
    try {
        return JSON.parse(row.value);
    } catch(e) {
        return defaultValue;
    }
}

function setConfig(key, value) {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    stmts.setConfig.run(key, serialized);
}

function queryKnowledgeBase({ query = '', category = '', page = 1, limit = 50 } = {}) {
    const allKb = getConfig('knowledgeBase', []);
    if (!Array.isArray(allKb)) return { total: 0, page: 1, limit, totalPages: 0, data: [] };

    let filtered = allKb;

    if (category && category.trim()) {
        const catClean = category.trim().toLowerCase();
        filtered = filtered.filter(item => item.category && item.category.toLowerCase().includes(catClean));
    }

    if (query && query.trim()) {
        const qClean = query.trim().toLowerCase();
        filtered = filtered.filter(item => {
            const title = (item.title || '').toLowerCase();
            const content = (item.content || '').toLowerCase();
            const keywords = (item.keywords || '').toLowerCase();
            return title.includes(qClean) || content.includes(qClean) || keywords.includes(qClean);
        });
    }

    const total = filtered.length;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 50));
    const totalPages = Math.ceil(total / limitNum);
    const offset = (pageNum - 1) * limitNum;
    const data = filtered.slice(offset, offset + limitNum);

    return {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        data
    };
}

function getAssignments(type = 'simulator') {
    const rows = stmts.getAssignmentsByType.all(type);
    return rows.map(r => r.user_id);
}

function setAssignments(type, userIds = [], assignedAt = Date.now()) {
    const setTx = db.transaction((t, ids, time) => {
        stmts.clearAssignmentsByType.run(t);
        for (const uid of ids) {
            if (uid && typeof uid === 'string') {
                stmts.insertAssignment.run(uid, t, time);
            }
        }
        // Save metadata
        const metaKey = t === 'ai-agent' ? 'aiAssignmentsMeta' : (t === 'call-simulator' ? 'callAssignmentsMeta' : 'assignmentsMeta');
        setConfig(metaKey, { assignedAt: time });
    });
    setTx(type, userIds, assignedAt);
}

function getAssignmentsMeta() {
    return {
        assignmentsMeta: getConfig('assignmentsMeta', { assignedAt: 0 }),
        aiAssignmentsMeta: getConfig('aiAssignmentsMeta', { assignedAt: 0 }),
        callAssignmentsMeta: getConfig('callAssignmentsMeta', { assignedAt: 0 })
    };
}

function getTestSession(key) {
    const row = stmts.getSession.get(key);
    if (!row) return null;
    return {
        userId: row.user_id,
        testType: row.test_type,
        startTime: row.start_time,
        duration: row.duration,
        completed: Boolean(row.completed),
        completedAt: row.completed_at
    };
}

function getAllTestSessions() {
    const rows = stmts.getAllSessions.all();
    const map = {};
    for (const r of rows) {
        map[r.session_key] = {
            userId: r.user_id,
            testType: r.test_type,
            startTime: r.start_time,
            duration: r.duration,
            completed: Boolean(r.completed),
            completedAt: r.completed_at
        };
    }
    return map;
}

function saveTestSession(session) {
    if (!session || !session.userId) return;
    const key = `${session.userId}_${session.testType || 'simulator'}`;
    stmts.upsertSession.run({
        session_key: key,
        user_id: session.userId,
        test_type: session.testType || 'simulator',
        start_time: session.startTime || Date.now(),
        duration: session.duration || 3600000,
        completed: session.completed ? 1 : 0,
        completed_at: session.completedAt || null
    });
}

function deleteTestSession(key) {
    stmts.deleteSession.run(key);
}

function clearSessionsByType(type) {
    stmts.deleteSessionsBySuffix.run(`%_${type}`);
}

function getResults() {
    const rows = stmts.getAllResults.all();
    return rows.map(r => {
        let details = {};
        if (r.details_json) {
            try { details = JSON.parse(r.details_json); } catch(e) {}
        }
        return {
            ...details,
            userId: r.user_id,
            userName: r.user_name,
            testType: r.test_type,
            date: r.date,
            score: r.score,
            percentage: r.percentage,
            correctCount: r.correct_count,
            wrongCount: r.wrong_count,
            totalCount: r.total_count
        };
    });
}

function addResult(result) {
    if (!result) return;
    const date = result.date || new Date().toISOString().replace('T', ' ').substring(0, 19);
    stmts.insertResult.run({
        user_id: result.userId || '',
        user_name: result.userName || '',
        test_type: result.testType || 'simulator',
        date: date,
        score: Number(result.score || 0),
        percentage: Number(result.percentage || 0),
        correct_count: Number(result.correctCount || 0),
        wrong_count: Number(result.wrongCount || 0),
        total_count: Number(result.totalCount || 0),
        details_json: JSON.stringify(result)
    });
}

function deleteResult(userId, date) {
    stmts.deleteResult.run(userId, date);
}

function getAiResults() {
    const rows = stmts.getAllAiResults.all();
    return rows.map(r => {
        let details = {};
        if (r.details_json) {
            try { details = JSON.parse(r.details_json); } catch(e) {}
        }
        return {
            ...details,
            userId: r.user_id,
            userName: r.user_name,
            date: r.date,
            score: r.score,
            percentage: r.percentage
        };
    });
}

function addAiResult(result) {
    if (!result) return;
    const date = result.date || new Date().toISOString().replace('T', ' ').substring(0, 19);
    stmts.insertAiResult.run({
        user_id: result.userId || '',
        user_name: result.userName || '',
        date: date,
        score: Number(result.score || 0),
        percentage: Number(result.percentage || 0),
        details_json: JSON.stringify(result)
    });
}

function deleteAiResult(userId, date) {
    stmts.deleteAiResult.run(userId, date);
}

function addCallSignal(toUserId, signalData) {
    if (!toUserId || !signalData) return;
    stmts.insertCallSignal.run(
        toUserId,
        signalData.fromUserId || '',
        signalData.fromUserName || '',
        signalData.type || '',
        JSON.stringify(signalData),
        Date.now()
    );
}

function getAndConsumeCallSignals(toUserId, maxAgeMs = 30000) {
    if (!toUserId) return [];
    const minTime = Date.now() - maxAgeMs;
    const rows = stmts.getCallSignals.all(toUserId, minTime);
    stmts.deleteCallSignalsByUserId.run(toUserId);
    return rows.map(r => {
        try {
            return JSON.parse(r.payload_json);
        } catch(e) {
            return null;
        }
    }).filter(Boolean);
}

// Clean signals older than 1 minute periodically
setInterval(() => {
    try {
        stmts.cleanOldSignals.run(Date.now() - 60000);
    } catch(e) {}
}, 30000).unref();

// 4. Automatic Initial Migration from db.json
function autoMigrateFromJson(defaultUsers, defaultKb, defaultAiScenarios, defaultSmtp, defaultCallScenarios) {
    const existingUsers = stmts.getAllUsers.all();
    if (existingUsers.length > 0) {
        return; // Already initialized
    }

    console.log('[SQLite Database] Initializing schema and migrating data...');
    const dbJsonPath = path.join(__dirname, 'db.json');
    let sourceData = null;

    if (fs.existsSync(dbJsonPath)) {
        try {
            const raw = fs.readFileSync(dbJsonPath, 'utf8');
            const clean = raw.charCodeAt(0) === 0xFEFF ? raw.slice(1) : raw;
            sourceData = JSON.parse(clean.trim());
        } catch(e) {
            console.warn('[SQLite Database] Failed to parse db.json, using defaults:', e.message);
        }
    }

    const migrationTx = db.transaction(() => {
        // Users
        const usersList = (sourceData && Array.isArray(sourceData.users) && sourceData.users.length > 0)
            ? sourceData.users
            : defaultUsers;

        const DEFAULT_ADMIN_HASH = '$2a$10$o4FTwCioUmAuKx0JRs9w5.CsbhEg2ja5uHexlVxJektlWXLw3WqI6';
        const DEFAULT_AGENT_HASH = '$2a$10$lWmIfNcNohSWKG9FFIkv3.GT5yK8CPXh2vkSA77jyqeT3ptp7XcP.';

        for (const u of usersList) {
            saveUser({
                id: u.id,
                name: u.name,
                email: u.email || '',
                passwordHash: u.passwordHash || (u.role === 'Admin' ? DEFAULT_ADMIN_HASH : DEFAULT_AGENT_HASH),
                role: u.role || 'Inbound'
            });
        }

        // Config items
        setConfig('knowledgeBase', (sourceData && sourceData.knowledgeBase) || defaultKb);
        setConfig('aiScenarios', (sourceData && sourceData.aiScenarios) || defaultAiScenarios);
        setConfig('scenarios', (sourceData && sourceData.scenarios) || null);
        setConfig('slides', (sourceData && sourceData.slides) || null);
        setConfig('callScenarios', (sourceData && sourceData.callScenarios) || defaultCallScenarios);
        setConfig('smtp', (sourceData && sourceData.smtp) || defaultSmtp);

        // Assignments
        if (sourceData && Array.isArray(sourceData.assignments)) {
            setAssignments('simulator', sourceData.assignments);
        }
        if (sourceData && Array.isArray(sourceData.aiAssignments)) {
            setAssignments('ai-agent', sourceData.aiAssignments);
        }
        if (sourceData && Array.isArray(sourceData.callAssignments)) {
            setAssignments('call-simulator', sourceData.callAssignments);
        }

        // Results
        if (sourceData && Array.isArray(sourceData.results)) {
            for (const r of sourceData.results) {
                addResult(r);
            }
        }
        if (sourceData && Array.isArray(sourceData.aiResults)) {
            for (const ar of sourceData.aiResults) {
                addAiResult(ar);
            }
        }

        // Test Sessions
        if (sourceData && sourceData.testSessions && typeof sourceData.testSessions === 'object') {
            for (const [key, sess] of Object.entries(sourceData.testSessions)) {
                if (sess && sess.userId) {
                    saveTestSession(sess);
                }
            }
        }
    });

    migrationTx();
    console.log('[SQLite Database] Migration completed successfully with WAL mode enabled.');
}

module.exports = {
    db,
    getUsers,
    getUserById,
    findUser,
    saveUser,
    updateUserEmail,
    getConfig,
    setConfig,
    getAssignments,
    setAssignments,
    getAssignmentsMeta,
    getTestSession,
    getAllTestSessions,
    saveTestSession,
    deleteTestSession,
    clearSessionsByType,
    getResults,
    addResult,
    deleteResult,
    getAiResults,
    addAiResult,
    deleteAiResult,
    addCallSignal,
    getAndConsumeCallSignals,
    autoMigrateFromJson,
    queryKnowledgeBase
};
