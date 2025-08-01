import express from 'express';
import { addToCart, getMyCart, updateCartItem, removeCartItem, clearCart } from '../Controllers/Cart_Con.js';
import { protect } from '../Middleware/authen_users.js';

const cartRoute = express.Router();

// All routes below are protected (user must be logged in)
cartRoute.use(protect);

// Add item to cart
cartRoute.post('/add/productId', addToCart);

// Get user's cart
cartRoute.get('/', getMyCart);

// Update item quantity in cart
cartRoute.put('/update', updateCartItem);

// Remove single item from cart
cartRoute.delete('/remove', removeCartItem);

// Clear entire cart
cartRoute.delete('/clear', clearCart);

export default cartRoute;
