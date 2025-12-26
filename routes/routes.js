import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Project from "../model/projects.js";
import Skill from "../model/skills.js";
import Resume from "../model/resume.js";
import nodemailer from "nodemailer";
import { verifyAdmin } from "../midlleware/auth.js"; // Correcting typo in import if needed, but keeping folder name as is

const route = express.Router();

// Fix __dirname for ES modules 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Admin Login
route.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    res.status(200).json({ success: true, token: process.env.ADMIN_PASS }); // Simple token
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Welcome route

route.get("/", (req, res) => {
  res.send("Welcome To the Portfolio API");
});

/* ================= SKILLS ================= */

// Get all skills
route.get("/skills", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.status(200).json({ success: true, data: skills });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch skills", error: error.message });
  }
});

// Add a skill
route.post("/skills", verifyAdmin, async (req, res) => {
  try {
    const { category, skills } = req.body;
    if (!category || !Array.isArray(skills) || skills.length === 0) {
      return res.status(400).json({ success: false, message: "Category and non-empty skills array are required" });
    }
    const newSkill = new Skill({ category, skills });
    await newSkill.save();
    res.status(201).json({ success: true, message: "Skill added successfully", data: newSkill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error saving skill", error: error.message });
  }
});

// Update a skill by ID
route.put("/skills/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // { category, skills }
    const updatedSkill = await Skill.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedSkill) return res.status(404).json({ success: false, message: "Skill not found" });
    res.status(200).json({ success: true, message: "Skill updated", data: updatedSkill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update skill", error: error.message });
  }
});

// Delete a skill by ID
route.delete("/skills/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSkill = await Skill.findByIdAndDelete(id);
    if (!deletedSkill) return res.status(404).json({ success: false, message: "Skill not found" });
    res.status(200).json({ success: true, message: "Skill deleted", data: deletedSkill });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete skill", error: error.message });
  }
});

/* ================= PROJECTS ================= */

// Get all projects
route.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find();
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch projects", error: error.message });
  }
});

// Add a project
route.post("/projects", verifyAdmin, async (req, res) => {
  try {
    const { title, tech, description, link } = req.body;
    if (!title || !description || !Array.isArray(tech) || tech.length === 0) {
      return res.status(400).json({ success: false, message: "Title, description, and non-empty tech array are required" });
    }
    const existing = await Project.findOne({ title });
    if (existing) return res.status(409).json({ success: false, message: "Project with this title already exists" });

    const newProject = new Project({ title, tech, description, link });
    await newProject.save();
    res.status(201).json({ success: true, message: "Project created", data: newProject });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create project", error: error.message });
  }
});

// Update a project by ID
route.put("/projects/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // { title, tech, description }
    const updatedProject = await Project.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedProject) return res.status(404).json({ success: false, message: "Project not found" });
    res.status(200).json({ success: true, message: "Project updated", data: updatedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update project", error: error.message });
  }
});

// Delete a project by ID
route.delete("/projects/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) return res.status(404).json({ success: false, message: "Project not found" });
    res.status(200).json({ success: true, message: "Project deleted", data: deletedProject });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete project", error: error.message });
  }
});

/* ================= RESUME ================= */

// Get resume (there should be only one)
route.get("/resume", async (req, res) => {
  try {
    const resume = await Resume.findOne();
    if (!resume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch resume", error: error.message });
  }
});

// Create or update resume (upsert)
route.post("/resume", verifyAdmin, async (req, res) => {
  try {
    const resumeData = req.body;
    if (!resumeData.fullName || !resumeData.title) {
      return res.status(400).json({ success: false, message: "Full name and title are required" });
    }

    // Find existing resume or create new one
    let resume = await Resume.findOne();
    if (resume) {
      // Update existing
      Object.assign(resume, resumeData);
      await resume.save();
      res.status(200).json({ success: true, message: "Resume updated", data: resume });
    } else {
      // Create new
      resume = new Resume(resumeData);
      await resume.save();
      res.status(201).json({ success: true, message: "Resume created", data: resume });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to save resume", error: error.message });
  }
});

// Update resume by ID
route.put("/resume/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const updatedResume = await Resume.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedResume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    res.status(200).json({ success: true, message: "Resume updated", data: updatedResume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update resume", error: error.message });
  }
});

// Delete resume
route.delete("/resume/:id", verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedResume = await Resume.findByIdAndDelete(id);
    if (!deletedResume) {
      return res.status(404).json({ success: false, message: "Resume not found" });
    }
    res.status(200).json({ success: true, message: "Resume deleted", data: deletedResume });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete resume", error: error.message });
  }
});

/* ================= DOWNLOAD RESUME FILE ================= */
route.get("/download-resume", (req, res) => {
  const publicDir = path.join(__dirname, "../public");
  const files = fs.readdirSync(publicDir);
  if (!files.length) return res.status(404).json({ message: "No file found to download" });

  const filePath = path.join(publicDir, files[0]);
  res.download(filePath, files[0], (err) => {
    if (err) res.status(500).json({ message: "Failed to download file" });
  });
});

/* ================= CONTACT FORM ================= */
route.post("/contact", async (req, res) => {
  try {
    const { fullname, email, subject, message } = req.body;

    // Validate required fields
    if (!fullname || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required"
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    // Check if email credentials are configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_PASS === 'your-app-password-here') {
      console.log("Contact form submission (email not configured):", { fullname, email, subject, message });
      return res.status(200).json({
        success: true,
        message: "Message received! (Email delivery pending configuration)"
      });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${subject || 'No Subject'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${fullname}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: "Message sent successfully!"
    });
  } catch (error) {
    console.error("Contact form error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
      error: error.message
    });
  }
});

export default route;
