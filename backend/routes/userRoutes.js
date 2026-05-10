const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {authenticate, authorize} = require("../middleware/Auth");

// ----- PUBLIC ROUTES -----

//regiter route
router.post("/register", async (req, res) => {
    const { firstName, lastName, email, phoneNumber, address, password } =
        req.body;

    try {
        // user exist or not
        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ message: "Already use this email" });
        }

        // password hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // save the user as new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            phoneNumber,
            address,
            password: hashedPassword,
        });

        await newUser.save();
        
        return res.status(200).json({
            success: true,
            message: "User Registered Successfully",
        });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
});

//login route
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Fields required!",
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res
                .status(400)
                .json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign(
            {
                userId: user._id,
                userEmail: user.email,
                userRole: user.role
            },
            process.env.ACCESS_TOKEN,
            { expiresIn: "1h" },
        );

        // Send cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 3600000,
        });

        // Success
        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            user: {
                _id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        return res.status(500).json({ error });
    }
});

// logout route
router.post("/logout", authenticate, async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
        });

        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ----- SUPERADMIN + ADMIN ROUTES -----

//count users
router.get("/count",authenticate, authorize("superadmin", "admin"), async (req, res) => {
    try {
        const count = await User.countDocuments({ role: "customer" });
        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


//get all users
router.get("/getallusers", async (req, res) => {
    try {
        const users = await User.find({ role: "user" });
        res.send({ users });
    } catch (error) {
        return res.status(400).json({ error });
    }
});

//get all admins
router.get("/getalladmins", async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" });
        res.send({ admins });
    } catch (error) {
        res.status(400).json({ error });
    }
});

//edit
router.patch("/edituser", async (req, res) => {
    const { _id, firstName, lastName, email, phoneNumber, address } = req.body;

    try {
        const user = await User.findById(_id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (address) user.address = address;

        await user.save();

        return res.json({ message: "User details updated successfully" });
    } catch (error) {
        return res.status(400).json({ error });
    }
});

//change password
router.patch("/changepassword", async (req, res) => {
    const { _id, currentPassword, newPassword } = req.body;

    try {
        const user = await User.findById(_id);
        if (!user) return res.status(404).send("User not found");

        if (user.password !== currentPassword) {
            return res.status(400).send("Current password does not match");
        }

        user.password = newPassword;
        await user.save();
        res.send("Password updated successfully");
    } catch (error) {
        console.log(error);
        res.status(500).send("Error updating password");
    }
});

//create admin
router.patch("/changeadmin", async (req, res) => {
    const { _id } = req.body;

    try {
        const user = await User.findById(_id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.role = "admin";
        await user.save();
        res.send("User role updated successfully");
    } catch (error) {
        console.log(error);
        res.status(400).send("Error updating user role");
    }
});

//delete user
router.patch("/deleteuser", async (req, res) => {
    const { _id } = req.body;

    try {
        const user = await User.findByIdAndRemove(_id);

        if (!user) return res.status(404).send("User not found");
        res.send("User deleted successfully");
    } catch (error) {
        console.log(error);
        res.status(400).send("Error deleting User");
    }
});



/* // GET a single user by id
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
}); */

module.exports = router;
