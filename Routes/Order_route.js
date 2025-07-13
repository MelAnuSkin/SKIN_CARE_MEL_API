import express from 'express';
import { createOrder, getAllOrders, getUserOrders, updateOrderStatus, updateMyOrder,
  cancelMyOrder } from '../Controllers/Order_Con.js';
import { protect, adminOnly } from '../Middleware/authen_users.js';

const orderRoute = express.Router();

orderRoute.post('/', protect, createOrder);
orderRoute.get('/my', protect, getUserOrders);
orderRoute.put('/:id', protect, updateMyOrder);
orderRoute.put('/:id/cancel', protect, cancelMyOrder);

// Admin-only
orderRoute.get('/', protect, adminOnly, getAllOrders);
orderRoute.put('/:id/status', protect, adminOnly, updateOrderStatus);

export default orderRoute;
