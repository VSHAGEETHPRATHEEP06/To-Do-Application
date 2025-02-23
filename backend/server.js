// import express from "express"
// import mongoose from "mongoose"
// import cors from "cors"
// import dotenv from "dotenv"

// import userRouter from "./routes/userRoute.js"
// import taskRouter from "./routes/taskRoute.js"
// import forgotPasswordRouter from "./routes/forgotPassword.js"

// //app config
// dotenv.config()
// const app = express()
// const port = process.env.PORT || 8001
// mongoose.set('strictQuery', true);

// //middlewares
// app.use(express.json())
// app.use(cors())

// //db config
// mongoose.connect("mongodb://127.0.0.1/todo_db", {
//     useNewUrlParser: true,
// }, (err) => {
//     if (err) {
//         console.log(err)
//     } else {
//         console.log("DB Connected")
//     }
// })

// //api endpoints
// app.use("/api/user", userRouter)
// app.use("/api/task", taskRouter)
// app.use("/api/forgotPassword", forgotPasswordRouter)

// //listen
// app.listen(port, () => console.log(`Listening on localhost:${port}`))



// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';

// const app = express();

// // Middleware setup
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// const connectDB = async () => {
//   try {
//     await mongoose.connect('mongodb://localhost:27017/mydb');
//     console.log('Connected to MongoDB');
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// };

// // Initialize connection
// connectDB();

// // Example route
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

// // Start the server
// app.listen(8000, () => {
//   console.log('Server is running on http://localhost:8000');
// });


//////


// import express from "express";
// import mongoose from "mongoose";
// import cors from "cors";
// import dotenv from "dotenv";

// import userRouter from "./routes/userRoute.js";
// import taskRouter from "./routes/taskRoute.js";
// //import forgotPasswordRouter from "./routes/forgotPassword.js";

// // App configuration
// dotenv.config();
// const app = express();
// const port = process.env.PORT || 8001;
// mongoose.set('strictQuery', true);

// // Middleware
// app.use(express.json());
// app.use(cors());

// // await mongoose.connect("mongodb://127.0.0.1/todo_db",
// // DB configuration (Updated for async/await)
// const connectDB = async () => {
//     try {
//         await mongoose.connect(MONGO_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true, // Ensure the connection uses the latest driver
//         });
//         console.log("DB Connected");
//     } catch (err) {
//         console.log("Error connecting to DB:", err);
//     }
// };

// // Connect to MongoDB
// connectDB();

// // API endpoints
// app.use("/api/user", userRouter);
// app.use("/api/task", taskRouter);
// //app.use("/api/forgotPassword", forgotPasswordRouter);

// // Start the server
// app.listen(port, () => console.log(`Listening on localhost:${port}`));

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
const port = process.env.PORT || 8001;
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
