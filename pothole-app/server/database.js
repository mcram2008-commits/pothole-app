const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, 'database.json');

// Initialize DB if not exists
if (!fs.existsSync(DB_FILE)) {
    const initialData = {
        users: [],
        reports: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2));

    // Create Default Admin
    (async () => {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('admin123', salt);
        const admin = {
            _id: 'admin_id_12345',
            username: 'Super Admin',
            email: 'admin@pothole.com',
            password: hash,
            phone: '0000000000',
            role: 'admin',
            isApproved: true,
            createdAt: new Date()
        };
        const db = JSON.parse(fs.readFileSync(DB_FILE));
        db.users.push(admin);
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
        console.log("Initialized DB with Admin.");
    })();
}

class Collection {
    constructor(name) {
        this.name = name;
    }

    _read() {
        return JSON.parse(fs.readFileSync(DB_FILE))[this.name];
    }

    _write(data) {
        const db = JSON.parse(fs.readFileSync(DB_FILE));
        db[this.name] = data;
        fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    }

    async find(query = {}) {
        const items = this._read();
        return items.filter(item => {
            for (let key in query) {
                if (query[key] && typeof query[key] === 'object' && query[key].$ne) {
                    if (item[key] === query[key].$ne) return false;
                } else if (query[key] && typeof query[key] === 'object' && query[key].$or) {
                    // Simple OR implementation for { $or: [{email}, {phone}] }
                    const match = query[key].$or.some(cond => {
                        const k = Object.keys(cond)[0];
                        return item[k] === cond[k];
                    });
                    if (!match) return false;
                } else if (item[key] !== query[key]) {
                    return false;
                }
            }
            return true;
        });
    }

    async findOne(query) {
        const items = await this.find(query);
        return items[0] || null;
    }

    async findById(id) {
        const items = this._read();
        return items.find(i => i._id === id) || null;
    }

    async create(doc) {
        const items = this._read();
        const newDoc = { ...doc, _id: Date.now().toString(), createdAt: new Date() };
        items.push(newDoc);
        this._write(items);
        return newDoc;
    }

    async save(doc) {
        // Compatibility with Mongoose instance.save()
        // In this mock, we just update the array if ID exists
        const items = this._read();
        const index = items.findIndex(i => i._id === doc._id);
        if (index !== -1) {
            items[index] = doc;
            this._write(items);
        } else {
            await this.create(doc);
        }
        return doc;
    }

    async findByIdAndUpdate(id, update, options) {
        const items = this._read();
        const index = items.findIndex(i => i._id === id);
        if (index !== -1) {
            // specific handling for $set if used, but simple merge for now
            const updated = { ...items[index], ...update };
            items[index] = updated;
            this._write(items);
            return updated;
        }
        return null;
    }

    // Helper to sort
    async findSorted(sortField) {
        const items = this._read();
        return items.sort((a, b) => new Date(b[sortField]) - new Date(a[sortField]));
    }
}

module.exports = {
    User: new Collection('users'),
    Report: new Collection('reports')
};
