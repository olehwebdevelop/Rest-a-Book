const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
const allowedOrigins = [
    "https://olehwebdevelop.github.io",
    "http://localhost:5000"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Blocked by CORS"));
        }
    },
    credentials: true
}));
app.use(express.static(__dirname));

const users = []; 

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_2026";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER || "your_email@gmail.com",
        pass: process.env.EMAIL_PASS || "your_app_password"
    }
});

app.post("/api/auth/register", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Please fill in all fields." });
        }

        if (users.find(u => u.email === email)) {
            return res.status(400).json({ message: "User already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        users.push({ email, password: hashedPassword, books: [] });

        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER || "your_email@gmail.com",
                to: email,
                subject: "Account Verification",
                text: "Welcome to Bookly!"
            });
        } catch (mailError) {
            console.warn("Mail dispatch failed");
        }

        res.status(201).json({ message: "Account created successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration." });
    }
});

app.post("/api/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email);
        
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password." });
        }

        const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "24h" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error during login." });
    }
});

app.delete("/api/auth/delete", (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
        
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const index = users.findIndex(u => u.email === decoded.email);
        if (index !== -1) {
            users.splice(index, 1);
            return res.status(200).json({ message: "Account deleted successfully" });
        }
        
        res.status(404).json({ message: "User not found" });
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
});

app.get("/api/books", (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = users.find(u => u.email === decoded.email);
        res.status(200).json(user ? user.books : []);
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
});

app.post("/api/books", (req, res) => {
    try {
        const { title, color } = req.body;
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = users.find(u => u.email === decoded.email);
        const newBook = { id: Date.now(), title, color };
        user.books.push(newBook);
        
        res.status(201).json(newBook);
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
});

app.delete("/api/books/:id", (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        
        const user = users.find(u => u.email === decoded.email);
        user.books = user.books.filter(b => b.id != req.params.id);
        
        res.status(200).json({ message: "Book deleted" });
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT} (Without MongoDB)`);
});
