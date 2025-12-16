const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Data file path
const DATA_FILE = path.join(__dirname, 'data.json');

// Helper to read data
function readData() {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return {};
    }
}

// Helper to write data
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Auth Middleware
const authMiddleware = (req, res, next) => {
    if (req.cookies.admin_token === 'secret_token_123') {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get('/', (req, res) => {
    const data = readData();
    res.render('index', { data });
});

app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const data = readData();
    // Check against stored credentials
    if (username === (data.adminUser || 'admin') && password === (data.adminPass || 'admin123')) {
        res.cookie('admin_token', 'secret_token_123', { httpOnly: true });
        res.redirect('/admin');
    } else {
        res.render('login', { error: 'بيانات الدخول غير صحيحة' });
    }
});

app.get('/admin', authMiddleware, (req, res) => {
    const data = readData();
    res.render('admin', { data });
});

app.post('/admin/update', authMiddleware, (req, res) => {
    const newData = {
        mainTitle: req.body.mainTitle,
        subTitle: req.body.subTitle,
        description: req.body.description,
        ctaText: req.body.ctaText,
        ctaLink: req.body.ctaLink,
        ctaVisible: req.body.ctaVisible === 'on', // Checkbox sends 'on' if checked
        logoType: req.body.logoType,
        logoUrl: req.body.logoUrl
    };
    writeData(newData);
    res.redirect('/admin');
});

app.post('/admin/update-credentials', authMiddleware, (req, res) => {
    const { newUsername, newPassword } = req.body;
    const data = readData();

    if (newUsername && newPassword) {
        data.adminUser = newUsername;
        data.adminPass = newPassword;
        writeData(data);
    }

    res.redirect('/admin');
});

app.get('/logout', (req, res) => {
    res.clearCookie('admin_token');
    res.redirect('/login');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
