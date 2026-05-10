const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
require("dotenv").config();

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);

        const existing = await User.findOne({ email: "superadmin@.com" });
        if (existing) {
            console.log("Super admin already exists!");
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash("superadmin123", 10);

        const superAdmin = new User({
            firstName: "Super",
            lastName: "Admin",
            email: "superadmin@pizza.com",
            password: hashedPassword,
            role: "superadmin",
            address: "Admin Address",
            phoneNumber: "0000000000",
        });

        await superAdmin.save();
        console.log("✅ Super admin created!");
    } catch (error) {
        console.log("Error: ", error.message);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

seedSuperAdmin();
