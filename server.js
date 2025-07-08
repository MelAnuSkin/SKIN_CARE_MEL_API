import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./Routes/User_route.js";

dotenv.config();

const app = express();


// MongoDB Connection

mongoose
  .connect(process.env.MONGO_URI, {
    
  })
  .then(() => console.log('Database connected'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });


// Middleware

app.use(express.json());





// API Routes

app.use('/api/auth', userRoute);


// Global Error Handler

app.use((err, req, res, next) => {
  console.error('error', err.stack);
  res.status(500).json({
    message: 'Server Error',
    error: err.message,
  });
});


// Start Server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
