import express from "express"
import route from "./routes/routes.js"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"

// Load environment variables
dotenv.config()

const app = express();
app.use(express.json())
const PORT = process.env.PORT
// CORS Configuration
const allowedOrigins = [
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
mongoose.connect(process.env.MONGODB_URI)
  .then(() => { console.log("Mongo Connected!") })
  .catch((err) => { console.log(err) })

import { notFound, errorHandler } from "./midlleware/errorMiddleware.js";

const dataRoute = route

// Health check endpoint for cold start wake-up pings
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use("/", dataRoute)

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});