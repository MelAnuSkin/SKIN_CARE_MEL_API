import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoute from "./Routes/User_route.js";
import productRoute from "./Routes/Product_routes.js";
import orderRoute from "./Routes/Order_route.js";
import paymentRoute from "./Routes/Payment_route.js";
import cartRoute from "./Routes/Cart_route.js";
import newsLetRoute from "./Routes/Newslet_route.js";

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
app.use(cors());





// API Routes

app.use('/api/auth', userRoute);
app.use('/api/products', productRoute);
app.use('/api/orders', orderRoute);
app.use('/api/payments', paymentRoute);
app.use('/api/carts', cartRoute);
app.use('/api/newsletter', newsLetRoute)


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
