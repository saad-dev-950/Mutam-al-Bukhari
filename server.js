const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Data file path
const DATA_FILE = path.join(__dirname, 'data', 'messages.json');
const CREDENTIALS_FILE = path.join(__dirname, 'data', 'admin.json');

// Initialize messages file if it doesn't exist
if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
}

const SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const sessions = new Map();

function createPasswordHash(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return { salt, hash };
}

function verifyPassword(password, storedPassword) {
    if (!storedPassword || !storedPassword.salt || !storedPassword.hash) {
        return false;
    }

    const hash = crypto.pbkdf2Sync(password, storedPassword.salt, 100000, 64, 'sha512').toString('hex');
    return hash === storedPassword.hash;
}

function readAdminCredentials() {
    try {
        if (!fs.existsSync(CREDENTIALS_FILE)) {
            const defaults = {
                username: 'admin',
                password: createPasswordHash('admin@123')
            };
            fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(defaults, null, 2));
            return defaults;
        }

        const raw = fs.readFileSync(CREDENTIALS_FILE, 'utf8');
        const parsed = JSON.parse(raw);

        if (!parsed.password || typeof parsed.password === 'string') {
            const defaults = {
                username: parsed.username || 'admin',
                password: createPasswordHash(parsed.password || 'admin@123')
            };
            fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(defaults, null, 2));
            return defaults;
        }

        return parsed;
    } catch (error) {
        const fallback = {
            username: 'admin',
            password: createPasswordHash('admin@123')
        };
        fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(fallback, null, 2));
        return fallback;
    }
}

function writeAdminCredentials(credentials) {
    fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(credentials, null, 2));
}

let adminCredentials = readAdminCredentials();

function readMessages() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeMessages(messages) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));
}

function createSessionId() {
    return crypto.randomBytes(24).toString('hex');
}

function getCookie(req, name) {
    const cookieHeader = req.headers.cookie || '';
    const cookies = cookieHeader.split(';').map(cookie => cookie.trim());
    const match = cookies.find(cookie => cookie.startsWith(`${name}=`));
    return match ? decodeURIComponent(match.split('=').slice(1).join('=')) : null;
}

function setAdminCookie(res, sessionId) {
    res.cookie('admin_session', sessionId, {
        httpOnly: true,
        sameSite: 'lax',
        maxAge: SESSION_TTL_MS,
        path: '/'
    });
}

function clearAdminCookie(res) {
    res.clearCookie('admin_session', { path: '/' });
}

function isValidSession(sessionId) {
    if (!sessionId) return false;
    const session = sessions.get(sessionId);
    if (!session) return false;
    if (Date.now() > session.expiresAt) {
        sessions.delete(sessionId);
        return false;
    }
    return true;
}

function requireAdmin(req, res, next) {
    const sessionId = getCookie(req, 'admin_session');
    if (!isValidSession(sessionId)) {
        if (req.accepts('html')) {
            return res.redirect('/?auth=required');
        }
        return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    req.admin = { username: sessions.get(sessionId).username };
    next();
}

// API: Submit contact form
app.post('/api/contact', (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({
            success: false,
            error: 'Name, email and message are required'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            error: 'Invalid email address'
        });
    }

    const newMessage = {
        id: Date.now(),
        name,
        email,
        phone: phone || '',
        subject: subject || 'No Subject',
        message,
        timestamp: new Date().toISOString(),
        read: false
    };

    const messages = readMessages();
    messages.push(newMessage);
    writeMessages(messages);

    res.json({
        success: true,
        message: 'Message sent successfully!'
    });
});

app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body || {};
    const credentials = readAdminCredentials();

    if (username === credentials.username && verifyPassword(password, credentials.password)) {
        const sessionId = createSessionId();
        sessions.set(sessionId, {
            username,
            expiresAt: Date.now() + SESSION_TTL_MS
        });
        setAdminCookie(res, sessionId);
        return res.json({ success: true, message: 'Login successful' });
    }

    return res.status(401).json({ success: false, error: 'Invalid admin credentials' });
});

app.put('/api/admin/credentials', requireAdmin, (req, res) => {
    const { currentPassword, newUsername, newPassword, confirmPassword } = req.body || {};
    const credentials = readAdminCredentials();

    if (!verifyPassword(currentPassword, credentials.password)) {
        return res.status(403).json({ success: false, error: 'Current password is incorrect' });
    }

    const trimmedUsername = (newUsername || '').trim();
    const trimmedPassword = (newPassword || '').trim();

    if (!trimmedUsername || trimmedPassword.length < 4) {
        return res.status(400).json({ success: false, error: 'Please enter a valid username and password' });
    }

    if (trimmedPassword !== (confirmPassword || '').trim()) {
        return res.status(400).json({ success: false, error: 'New passwords do not match' });
    }

    const updatedCredentials = {
        username: trimmedUsername,
        password: createPasswordHash(trimmedPassword)
    };

    writeAdminCredentials(updatedCredentials);
    adminCredentials = updatedCredentials;

    res.json({ success: true, message: 'Admin credentials updated successfully' });
});

app.post('/api/admin/logout', (req, res) => {
    const sessionId = getCookie(req, 'admin_session');
    if (sessionId) {
        sessions.delete(sessionId);
    }
    clearAdminCookie(res);
    res.json({ success: true, message: 'Logged out' });
});

app.get('/api/admin/check', (req, res) => {
    const sessionId = getCookie(req, 'admin_session');
    res.json({ authenticated: isValidSession(sessionId) });
});

// API: Get all messages (Admin)
app.get('/api/messages', requireAdmin, (req, res) => {
    const messages = readMessages();
    res.json({ success: true, messages });
});

// API: Mark message as read
app.put('/api/messages/:id/read', requireAdmin, (req, res) => {
    const messages = readMessages();
    const messageIndex = messages.findIndex(m => m.id === parseInt(req.params.id));

    if (messageIndex === -1) {
        return res.status(404).json({ success: false, error: 'Message not found' });
    }

    messages[messageIndex].read = true;
    writeMessages(messages);

    res.json({ success: true, message: 'Marked as read' });
});

// API: Delete message
app.delete('/api/messages/:id', requireAdmin, (req, res) => {
    let messages = readMessages();
    const initialLength = messages.length;
    messages = messages.filter(m => m.id !== parseInt(req.params.id));

    if (messages.length === initialLength) {
        return res.status(404).json({ success: false, error: 'Message not found' });
    }

    writeMessages(messages);
    res.json({ success: true, message: 'Message deleted' });
});

// API: Get unread count
app.get('/api/messages/unread-count', requireAdmin, (req, res) => {
    const messages = readMessages();
    const unreadCount = messages.filter(m => !m.read).length;
    res.json({ success: true, count: unreadCount });
});

// Serve admin panel
app.get('/admin', requireAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
