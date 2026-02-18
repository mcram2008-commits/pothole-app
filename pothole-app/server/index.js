const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- DATABASE CONFIGURATION ---
const DB_FILE = path.join(__dirname, 'database.json');

// Ensure DB exists with default structure (Auto-Seeds 3 Users)
const initializeDB = async () => {
    if (!fs.existsSync(DB_FILE)) {
        console.log("Initializing local database...");
        const initialData = { users: [], reports: [] };

        // 1. ADMIN
        const adminHash = await bcrypt.hash('admin123', 10);
        initialData.users.push({
            _id: 'admin-12345',
            username: 'Super Admin',
            email: 'admin@pothole.com',
            password: adminHash,
            phone: '9999999999',
            role: 'admin',
            isApproved: true,
            createdAt: new Date()
        });

        // 2. OFFICER (Auto-Approved)
        const officerHash = await bcrypt.hash('officer123', 10);
        initialData.users.push({
            _id: 'officer-12345',
            username: 'Officer Dave',
            email: 'officer@pothole.com',
            password: officerHash,
            phone: '8888888888',
            role: 'officer',
            isApproved: true,
            createdAt: new Date()
        });

        // 3. CITIZEN
        const citizenHash = await bcrypt.hash('citizen123', 10);
        initialData.users.push({
            _id: 'citizen-12345',
            username: 'Citizen Jane',
            email: 'citizen@pothole.com',
            password: citizenHash,
            phone: '7777777777',
            role: 'citizen',
            isApproved: true,
            createdAt: new Date()
        });

        fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));
        console.log("✅ Database created at " + DB_FILE);
        console.log("✅ Accounts Created: Admin, Officer, Citizen");
    }
};

initializeDB();

// Helper functions to interact with the JSON DB
const readDB = () => {
    try {
        if (!fs.existsSync(DB_FILE)) initializeDB();
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading DB:", err);
        return { users: [], reports: [] };
    }
};

const writeDB = (data) => {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error("Error writing DB:", err);
    }
};

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'hackathon_secret_key_123';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
}

// --- AUTH MIDDLEWARE --- //
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: 'Access Denied' });

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};

const verifyAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') next();
    else res.status(403).json({ error: 'Admin Access Required' });
};

// --- ROUTES --- //

// 1. REGISTER
app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, email, password, phone, role, isAdminCreated } = req.body;
        const db = readDB();

        if (db.users.find(u => u.email === email)) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newRole = role === 'officer' ? 'officer' : 'citizen';

        // Admin-created officers are auto-approved
        let isApproved = false;
        if (newRole === 'citizen') isApproved = true;
        if (isAdminCreated) isApproved = true;

        const newUser = {
            _id: Date.now().toString(),
            username,
            email,
            password: hashedPassword,
            phone,
            role: newRole,
            isApproved,
            createdAt: new Date()
        };

        db.users.push(newUser);
        writeDB(db);

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
});

// 2. LOGIN
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, role } = req.body;
        const db = readDB();

        const user = db.users.find(u => u.email === email);
        if (!user) return res.status(400).json({ error: 'User not found' });

        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ error: 'Invalid password' });

        // Role verification (Allow admin to login regardless of role selector if needed, but enforce for others)
        if (role && user.role !== role) {
            if (user.role !== 'admin') {
                return res.status(403).json({ error: `You are registered as ${user.role}, not ${role}` });
            }
        }

        if (user.role === 'officer' && !user.isApproved) {
            return res.status(403).json({ error: 'Account pending admin approval.' });
        }

        const token = jwt.sign({ _id: user._id, role: user.role, username: user.username }, JWT_SECRET, { expiresIn: '1d' });
        res.json({ token, user: { _id: user._id, username: user.username, role: user.role, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. ADMIN: GET USERS
app.get('/api/admin/users', verifyToken, verifyAdmin, (req, res) => {
    const db = readDB();
    const users = db.users.filter(u => u.role !== 'admin');
    res.json(users);
});

// 4. ADMIN: APPROVE OFFICER
app.put('/api/admin/users/:id/approve', verifyToken, verifyAdmin, (req, res) => {
    const db = readDB();
    const userIndex = db.users.findIndex(u => u._id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });

    db.users[userIndex].isApproved = !db.users[userIndex].isApproved;
    writeDB(db);
    res.json(db.users[userIndex]);
});

// 5. ADMIN: DELETE USER
app.delete('/api/admin/users/:id', verifyToken, verifyAdmin, (req, res) => {
    const db = readDB();
    const userIndex = db.users.findIndex(u => u._id === req.params.id);
    if (userIndex === -1) return res.status(404).json({ error: "User not found" });

    db.users.splice(userIndex, 1);
    writeDB(db);
    res.json({ message: "User deleted" });
});


// --- REPORTS --- //

// GET Reports
app.get('/api/reports', (req, res) => {
    const db = readDB();
    // Return ALL reports. Frontend filters or sorts.
    res.json(db.reports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// MY Reports
app.get('/api/my-reports', verifyToken, (req, res) => {
    const db = readDB();
    const myReports = db.reports.filter(r => r.userId === req.user._id);
    res.json(myReports.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// POST Report
const upload_config = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/'),
        filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
    })
});

app.post('/api/reports', verifyToken, upload_config.single('image'), (req, res) => {
    try {
        const { latitude, longitude, description, severity } = req.body;
        const db = readDB();

        const newReport = {
            _id: Date.now().toString(),
            userId: req.user._id,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            description,
            severity,
            status: 'Pending',
            createdAt: new Date()
        };

        db.reports.push(newReport);
        writeDB(db);
        res.status(201).json(newReport);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to save report" });
    }
});

// UPDATE Status
app.put('/api/reports/:id/status', verifyToken, (req, res) => {
    const { status } = req.body;
    // Citizens cannot update status, only Admins and Officers
    if (req.user.role === 'citizen') return res.status(403).json({ error: "Citizens cannot update status" });

    const db = readDB();
    const reportIndex = db.reports.findIndex(r => r._id === req.params.id);
    if (reportIndex === -1) return res.status(404).json({ error: "Report not found" });

    db.reports[reportIndex].status = status;
    writeDB(db);
    res.json(db.reports[reportIndex]);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (Using Local JSON DB)`);
});
