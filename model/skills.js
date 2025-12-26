import mongoose from "mongoose";

// Sub-schema for individual skills
const skillItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId() // unique ID for each skill
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
});

// Main schema
const skills = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId() // unique ID for category
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  skills: {
    type: [skillItemSchema],
    required: true,
    validate: {
      validator: v => v.length > 0,
      message: "Skills array cannot be empty"
    }
  }
}, { timestamps: true });

export default mongoose.model("Skill", skills);
