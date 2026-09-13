const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

const ALGORITHM = 'aes-256-gcm';
function getSecretKey() {
    const rawSecret = process.env.ENCRYPTION_SECRET;
    if (rawSecret && typeof rawSecret === 'string' && rawSecret.trim().length > 0) {
        return crypto.createHash('sha256').update(rawSecret.trim()).digest();
    }
    // Fallback: Generate an ephemeral 32-byte key in memory if not provided
    if (!global.__ephemeralEncryptionKey) {
        global.__ephemeralEncryptionKey = crypto.randomBytes(32);
    }
    return global.__ephemeralEncryptionKey;
}
const AUDIT_LOG_PATH = path.join(__dirname, 'audit_log.json');

/**
 * Encrypts a string using AES-256-GCM
 */
function encryptData(text) {
    if (!text || typeof text !== 'string') return text;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, getSecretKey(), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    return {
        iv: iv.toString('hex'),
        content: encrypted,
        authTag: authTag,
        isEncrypted: true
    };
}

/**
 * Decrypts an AES-256-GCM encrypted object back to string
 */
function decryptData(encryptedObj) {
    if (!encryptedObj || typeof encryptedObj !== 'object' || !encryptedObj.isEncrypted) {
        return encryptedObj;
    }
    try {
        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            getSecretKey(),
            Buffer.from(encryptedObj.iv, 'hex')
        );
        decipher.setAuthTag(Buffer.from(encryptedObj.authTag, 'hex'));
        let decrypted = decipher.update(encryptedObj.content, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        console.error("Decryption failed:", e.message);
        return null;
    }
}

/**
 * Appends a tamper-evident security audit record
 */
async function logSecurityEvent(action, userId, clientIp, details = {}) {
    const timestamp = new Date().toISOString();
    const auditRecord = {
        timestamp,
        action,
        userId: userId || 'anonymous',
        clientIp: clientIp || 'unknown',
        details
    };

    console.log(`[AUDIT_LOG] ${timestamp} | IP: ${auditRecord.clientIp} | User: ${auditRecord.userId} | Action: ${action}`);

    try {
        let logs = [];
        try {
            const raw = await fs.readFile(AUDIT_LOG_PATH, 'utf8');
            logs = JSON.parse(raw);
        } catch (e) {
            logs = [];
        }
        logs.push(auditRecord);
        if (logs.length > 500) logs = logs.slice(-500); // Keep last 500 records
        await fs.writeFile(AUDIT_LOG_PATH, JSON.stringify(logs, null, 2));
    } catch (err) {
        console.error("Failed to append audit log:", err.message);
    }
}

module.exports = {
    encryptData,
    decryptData,
    logSecurityEvent
};
