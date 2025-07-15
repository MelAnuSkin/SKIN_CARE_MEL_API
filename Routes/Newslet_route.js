import express from 'express';
import { sendNewsletter, subscribeNewsletter} from '../Controllers/Newslet_Con.js';
import { adminOnly, protect } from '../Middleware/authen_users.js';

const newsLetRoute = express.Router();

// Public
newsLetRoute.post('/subscribe', subscribeNewsletter);

// Admin
newsLetRoute.post('/send', protect, adminOnly, sendNewsletter);

export default newsLetRoute;
