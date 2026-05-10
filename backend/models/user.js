const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },
        phoneNumber: {
            type: String,
            required: true,
            unique: true,
        },
        address: {
            type: String,
            required: true,
        },

        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["superadmin", "admin", "customer"],
            default: "customer",
        },
    },
    {
        timestamps: true,
    },
);

module.exports = mongoose.model("users", userSchema);
