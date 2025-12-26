import express from "express"
import route from "../backend/routes/routes.js"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const app = express();
app.use(express.json())
const PORT = process.env.PORT || 3000;
// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173", // Local frontend
  "http://localhost:5174", // Local frontend (alternate port)
  "http://localhost:4173", // Local preview
  process.env.FRONTEND_URL // Production URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// MongoDB connection using environment variable
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/portfolio")
  .then(() => { console.log("Mongo Connected!") })
  .catch((err) => { console.log(err) })

import { notFound, errorHandler } from "./midlleware/errorMiddleware.js";

const dataRoute = route

app.use("/", dataRoute)

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});