import express from "express";
import { createUser, findUserByEmail, comparePassword } from "../../models/account/index.js";

const router = express.Router();

// 🔹 GET Register Page
router.get("/register", (req, res) => {
    res.render("account/register", { title: "Register" });
});

// 🔹 POST Register Form
router.post("/register", async (req, res) => {
    const { username, email, password, confirm_password } = req.body;

    // Validate fields
    if (!username || !email || !password || !confirm_password) {
        return res.status(400).send("❌ All fields are required.");
    }

    // Check if passwords match
    if (password !== confirm_password) {
        return res.status(400).send("❌ Passwords do not match.");
    }

    try {
        // Check if user already exists by email
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).send("❌ Email is already in use.");
        }

        // Create new user with username and password
        const newUser = await createUser(username, email, password);
        
        // Send only the message without the user data
        res.status(201).send("✅ User registered successfully!");
    } catch (error) {
        console.error(error);
        res.status(500).send("❌ Error registering user.");
    }
});

// 🔹 GET Login Page
router.get("/login", (req, res) => {
    res.render("account/login", { title: "Login" });
});

// 🔹 POST Login Form
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(400).send("❌ User not found.");
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(400).send("❌ Incorrect password.");
        }

        // Store the user ID and role in the session to track login state
        req.session.userId = user.id;
        req.session.userRole = user.role;

        // Redirect based on the user's role
        if (user.role === 'admin' || user.role === 'owner') {
            return res.redirect('/admin'); // Admin or owner goes to admin dashboard
        } else {
            return res.redirect('/notes'); // Regular user goes to notes
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("❌ Error logging in.");
    }
});

// 🔹 GET Logout
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("❌ Error logging out.");
        }
        res.redirect('/account/login'); // Redirect to the login page after logout
    });
});


export default router;
