import mongoose from "mongoose";

// Sub-schema for experience items
const experienceSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  }
});

// Sub-schema for education items
const educationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  institution: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    trim: true
  },
  grade: {
    type: String,
    trim: true
  }
});

// Sub-schema for certifications
const certificationSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  issuer: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  }
});

// Main Resume schema
const resumeSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  summary: {
    type: String,
    trim: true
  },
  experience: {
    type: [experienceSchema],
    default: []
  },
  education: {
    type: [educationSchema],
    default: []
  },
  certifications: {
    type: [certificationSchema],
    default: []
  },
  linkedinUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  twitterUrl: {
    type: String,
    trim: true
  },
  instagramUrl: {
    type: String,
    trim: true
  },
  googleUrl: {
    type: String,
    trim: true
  },
  portfolioUrl: {
    type: String,
    trim: true
  },
  resumeFileUrl: {
    type: String,
    trim: true
  }
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
