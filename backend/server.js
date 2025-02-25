import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import userRouter from "./routes/userRoute.js";
import taskRouter from "./routes/taskRoute.js";
// import forgotPasswordRouter from "./routes/forgotPassword.js";

// App configuration
dotenv.config();
const app = express();
const port = process.env.PORT || 8000;
mongoose.set("strictQuery", true);

// Middleware
app.use(express.json());
app.use(cors());

// DB configuration (Updated for async/await)
const MONGO_URI = process.env.MONGO_URI; // Load the URI from the .env file
const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("DB Connected");
    } catch (err) {
        console.error("Error connecting to DB:", err);
        process.exit(1); // Exit process with failure
    }
};

// Connect to MongoDB
connectDB();

// API endpoints
app.use("/api/user", userRouter);
app.use("/api/task", taskRouter);
// app.use("/api/forgotPassword", forgotPasswordRouter);

// Start the server
app.listen(port, () => console.log(`Listening on localhost:${port}`));
