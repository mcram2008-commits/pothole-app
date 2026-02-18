const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGO_URI = 'mongodb://127.0.0.1:27017/pothole_app'; // Use 127.0.0.1 instead of localhost for better Windows compatibility

// Schema Definition (Must match server)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'officer', 'citizen'], default: 'citizen' },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function run() {
    console.log("----------------------------------------");
    console.log("   ADMIN RESET TOOL - STARTING");
    console.log("----------------------------------------");

    try {
        console.log(`[1/4] Attempting connection to: ${MONGO_URI}`);
        await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("[1/4] Connection SUCCESS!");

        console.log("[2/4] Clearing old admin data...");
        const delResult = await User.deleteMany({ role: 'admin' });
        console.log(`      Deleted ${delResult.deletedCount} old admin account(s).`);

        console.log("[3/4] Creating new Admin (admin@pothole.com / admin123)...");
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash('admin123', salt);

        await User.create({
            username: 'Super Admin',
            email: 'admin@pothole.com',
            password: hash,
            phone: '0000000000',
            role: 'admin',
            isApproved: true
        });
        console.log("[3/4] Admin Account Created Successfully.");

        console.log("[4/4] Listing all users in DB:");
        const allUsers = await User.find({});
        if (allUsers.length === 0) {
            console.log("      (No users found besides admin)");
        }
        allUsers.forEach(u => {
            console.log(`      - ${u.role.toUpperCase()}: ${u.email} (Approved: ${u.isApproved})`);
        });

        console.log("\n----------------------------------------");
        console.log("   RESET COMPLETE - YOU CAN LOGIN NOW");
        console.log("----------------------------------------");
        process.exit(0);

    } catch (error) {
        console.error("\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.error("   FATAL ERROR:");
        console.error(error);
        console.error("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        console.error("TIP: Is your MongoDB server running?");
        process.exit(1);
    }
}

run();
