import mongoose from "mongoose";
import dotenv from "dotenv";
import Project from "./model/projects.js";
import Skill from "./model/skills.js";
import Resume from "./model/resume.js";

// Load environment variables
dotenv.config();

const mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio";

// Sample data
const skillsData = [
    {
        category: "Frontend",
        skills: [
            { name: "React" },
            { name: "Next.js" },
            { name: "Tailwind CSS" },
            { name: "JavaScript" },
            { name: "HTML" },
            { name: "CSS" }
        ]
    },
    {
        category: "Backend",
        skills: [
            { name: "Node.js" },
            { name: "Express" },
            { name: "MongoDB" },
            { name: "PostgreSQL" },
            { name: "REST APIs" }
        ]
    },
    {
        category: "DevOps",
        skills: [
            { name: "Docker" },
            { name: "Kubernetes" },
            { name: "AWS" },
            { name: "CI/CD" },
            { name: "Nginx" }
        ]
    },
    {
        category: "Tools & Misc",
        skills: [
            { name: "Git" },
            { name: "Figma" },
            { name: "VS Code" },
            { name: "Jest" },
            { name: "ESLint" }
        ]
    }
];

const projectsData = [
    {
        title: "Blog_Site_CRUD",
        tech: [{ name: "React" }, { name: "ExpressJs" }, { name: "NodeJs" }],
        description: "Developed a dynamic blog website featuring full Create, Read, Update, and Delete (CRUD) functionality for posts and user management protocols.",
        link: "https://github.com/srinia7san"
    },
    {
        title: "Auto_Data_Entry_Bot",
        tech: [{ name: "Python" }, { name: "Selenium" }, { name: "BeautifulSoup" }],
        description: "Built a Python script to automate data transfer from target websites into spreadsheets, significantly improving efficiency and reducing manual entry errors.",
        link: "https://github.com/srinia7san"
    },
    {
        title: "Sec_Pass_Manager",
        tech: [{ name: "Python" }, { name: "Tkinter" }, { name: "Cryptography" }],
        description: "Built a Tkinter-based manager with secure random password generation, encrypted CSV storage, clipboard integration, and strength validation algorithms.",
        link: "https://github.com/srinia7san"
    },
    {
        title: "Portfolio_Website",
        tech: [{ name: "React" }, { name: "Tailwind CSS" }, { name: "Vite" }],
        description: "Designed and developed a responsive personal portfolio website showcasing projects, skills, and contact information with a modern UI.",
        link: "https://github.com/srinia7san"
    },
    {
        title: "Task_Management_App",
        tech: [{ name: "React" }, { name: "Node.js" }, { name: "Express" }, { name: "MongoDB" }],
        description: "Created a full-stack task management application with user authentication, task prioritization, and real-time status updates.",
        link: "https://github.com/srinia7san"
    },
    {
        title: "E_Commerce_API",
        tech: [{ name: "Node.js" }, { name: "Express" }, { name: "MongoDB" }],
        description: "Developed a RESTful API for an e-commerce platform supporting product management, user authentication, and order processing.",
        link: "https://github.com/srinia7san"
    },
    {
        title: "Chat_Application",
        tech: [{ name: "React" }, { name: "Socket.io" }, { name: "Node.js" }],
        description: "Built a real-time chat application enabling instant messaging, typing indicators, and online user tracking.",
        link: "https://github.com/srinia7san"
    },
    {
        title: "Weather_Dashboard",
        tech: [{ name: "JavaScript" }, { name: "OpenWeather API" }, { name: "HTML" }, { name: "CSS" }],
        description: "Implemented a weather dashboard that fetches and displays real-time weather data with location-based forecasts.",
        link: "https://github.com/srinia7san"
    }
];

const resumeData = {
    fullName: "SRINIVASAN M",
    title: "Full Stack Developer",
    email: "srinivasan.mmca@gmail.com",
    phone: "+91 1234567890",
    location: "India",
    summary: "Passionate Full Stack Developer with expertise in modern web technologies. Specialized in building scalable web applications using React, Node.js, and MongoDB. Committed to writing clean, maintainable code and creating exceptional user experiences.",

    experience: [
        {
            role: "Full Stack Developer",
            company: "Tech Solutions Inc.",
            duration: "2022 - Present",
            description: "Developed and maintained full-stack web applications using React, Node.js, and MongoDB. Collaborated with cross-functional teams to deliver high-quality software solutions."
        },
        {
            role: "Frontend Developer",
            company: "Digital Agency",
            duration: "2020 - 2022",
            description: "Created responsive and interactive user interfaces using React and modern CSS frameworks. Worked closely with designers to implement pixel-perfect designs."
        }
    ],

    education: [
        {
            degree: "Master of Computer Applications",
            institution: "University Name",
            year: "2020",
            description: "Specialized in Software Engineering and Web Development"
        },
        {
            degree: "Bachelor of Computer Science",
            institution: "College Name",
            year: "2018",
            description: "Foundation in Computer Science fundamentals and programming"
        }
    ],

    certifications: [
        {
            name: "AWS Certified Solutions Architect",
            issuer: "Amazon Web Services",
            year: "2023"
        },
        {
            name: "MongoDB Certified Developer",
            issuer: "MongoDB University",
            year: "2022"
        },
        {
            name: "React Professional Certificate",
            issuer: "Meta",
            year: "2021"
        }
    ],

    // Social Links
    linkedinUrl: "https://www.linkedin.com/in/srinivasan-m-0aa2a3260",
    githubUrl: "https://github.com/srinia7san",
    googleUrl: "https://share.google/UIW2GFvCCySXopwXZ",
    twitterUrl: "",
    instagramUrl: "",
    portfolioUrl: ""
};

// Main seed function
async function seedDatabase() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(mongoURI);
        console.log("✅ MongoDB connected successfully!");

        // Clear existing data
        console.log("🗑️  Clearing existing data...");
        await Promise.all([
            Skill.deleteMany({}),
            Project.deleteMany({}),
            Resume.deleteMany({})
        ]);
        console.log("✅ Existing data cleared!");

        // Insert skills
        console.log("📚 Inserting skills...");
        const insertedSkills = await Skill.insertMany(skillsData);
        console.log(`✅ Inserted ${insertedSkills.length} skill categories!`);

        // Insert projects
        console.log("💼 Inserting projects...");
        const insertedProjects = await Project.insertMany(projectsData);
        console.log(`✅ Inserted ${insertedProjects.length} projects!`);

        // Insert resume
        console.log("📄 Inserting resume data...");
        const insertedResume = await Resume.create(resumeData);
        console.log(`✅ Resume created successfully!`);

        console.log("\n🎉 Database seeded successfully!");
        console.log("\n📊 Summary:");
        console.log(`   - Skills: ${insertedSkills.length} categories`);
        console.log(`   - Projects: ${insertedProjects.length} items`);
        console.log(`   - Resume: 1 document`);

    } catch (error) {
        console.error("❌ Error seeding database:", error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 Connection closed.");
    }
}

// Run the seed function
seedDatabase();
