import mongoose from "mongoose";
import Project from "./model/projects.js";

const mongoURI = "mongodb://127.0.0.1:27017/portfolio";
const GITHUB_LINK = "https://github.com/srinia7san"; // 👈 change if needed

mongoose.connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));

const updateLinks = async () => {
  try {
    const result = await Project.updateMany(
      {}, // update all projects
      {
        $set: {
          link: GITHUB_LINK
        }
      }
    );

    console.log(`✅ Updated ${result.modifiedCount} projects with GitHub link`);
  } catch (err) {
    console.error("❌ Error updating project links:", err);
  } finally {
    mongoose.connection.close();
  }
};

updateLinks();
