import mongoose from "mongoose";

// Sub-schema for each tech item
const techItemSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId() // unique ID for each tech
  },
  name: {
    type: String,
    required: true,
    trim: true
  }
}); 

// Main project schema
const projects = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      default: () => new mongoose.Types.ObjectId() // unique ID for project
    },
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    tech: {
      type: [techItemSchema],
      required: true,
      validate: {
        validator: v => v.length > 0,
        message: "Tech stack cannot be empty"
      }
    },
    description: {
      type: String,
      required: true,
      minlength: 10
    },
    link:{
      type:String,
      required:true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Project", projects);
