const bcrypt = require("bcrypt");
const User = require('../models/usermodel');

const migratePasswords = async () => {
    try {
        const users = await User.find();
        for (const user of users) {
            if (!user.password.startsWith("$2b$")) { // only hash plain-text
                user.password = await bcrypt.hash(user.password, 10);
                await user.save();
                console.log(`🔑 Migrated user: ${user.email}`);
            }
        }
        console.log("✅ Migration complete");
    } catch (err) {
        console.error("❌ Migration failed:", err);
    }
}

module.exports = migratePasswords;
