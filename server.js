const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require("express");
const cors=require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const Profile = require("./models/Profile");
const Education = require("./models/Education");
const Skill = require("./models/Skill");
const Project = require("./models/Project");
const Certification = require("./models/Certification");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.log("MongoDB connection failed");
        console.log(error);
    });

app.get("/", (req, res) => {
    res.send("Student Portfolio & Resume Builder Backend is Running");
});

app.get("/api/test", (req, res) => {
    res.json({
        message: "API is working successfully"
    });
});

app.post("/api/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: "Registration successful"
        });

    } catch (error) {
        res.status(500).json({
            message: "Registration failed",
            error: error.message
        });
    }
});
app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        res.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
});
app.post("/api/profile", async (req, res) => {
    try {
        const { userId, phone, location, objective, photo } = req.body;

        const profile = new Profile({
            userId,
            phone,
            location,
            objective,
            photo
        });

        await profile.save();

        res.status(201).json({
            message: "Profile saved successfully",
            profile
        });

    } catch (error) {
        res.status(500).json({
            message: "Profile saving failed",
            error: error.message
        });
    }
});
app.post("/api/education", async (req, res) => {
    try {
        const { userId, degree, college, department, cgpa, year } = req.body;

        const education = new Education({
            userId,
            degree,
            college,
            department,
            cgpa,
            year
        });

        await education.save();

        res.status(201).json({
            message: "Education saved successfully",
            education
        });

    } catch (error) {
        res.status(500).json({
            message: "Education saving failed",
            error: error.message
        });
    }
});
app.post("/api/skills", async (req, res) => {
    try {
        const { userId, skillName, level } = req.body;

        const skill = new Skill({
            userId,
            skillName,
            level
        });

        await skill.save();

        res.status(201).json({
            message: "Skill saved successfully",
            skill
        });

    } catch (error) {
        res.status(500).json({
            message: "Skill saving failed",
            error: error.message
        });
    }
});
app.post("/api/projects", async (req, res) => {
    try {
        const { userId, title, description, technologies, githubLink } = req.body;

        const project = new Project({
            userId,
            title,
            description,
            technologies,
            githubLink
        });

        await project.save();

        res.status(201).json({
            message: "Project saved successfully",
            project
        });

    } catch (error) {
        res.status(500).json({
            message: "Project saving failed",
            error: error.message
        });
    }
});
app.post("/api/certifications", async (req, res) => {
    try {
        const { userId, certificateName, organization, certificateLink } = req.body;

        const certification = new Certification({
            userId,
            certificateName,
            organization,
            certificateLink
        });

        await certification.save();

        res.status(201).json({
            message: "Certification saved successfully",
            certification
        });

    } catch (error) {
        res.status(500).json({
            message: "Certification saving failed",
            error: error.message
        });
    }
});
app.get("/api/resume/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).select("-password");
        const profile = await Profile.findOne({ userId });
        const education = await Education.find({ userId });
        const skills = await Skill.find({ userId });
        const projects = await Project.find({ userId });
        const certifications = await Certification.find({ userId });

        res.json({
            user,
            profile,
            education,
            skills,
            projects,
            certifications
        });

    } catch (error) {
        res.status(500).json({
            message: "Resume data fetching failed",
            error: error.message
        });
    }
});
app.get("/api/portfolio/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId).select("-password");
        const profile = await Profile.findOne({ userId });
        const education = await Education.find({ userId });
        const skills = await Skill.find({ userId });
        const projects = await Project.find({ userId });
        const certifications = await Certification.find({ userId });

        res.json({
            name: user.name,
            email: user.email,
            profile,
            education,
            skills,
            projects,
            certifications
        });

    } catch (error) {
        res.status(500).json({
            message: "Portfolio data fetching failed",
            error: error.message
        });
    }
});
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});