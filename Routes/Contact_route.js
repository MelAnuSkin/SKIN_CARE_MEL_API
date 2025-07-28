import express from 'express';
import { sendMessage, getAllMessages } from '../Controllers/Contact_Con.js';
import { adminOnly } from '../Middleware/authen_users.js';

const contactRoute = express.Router();

contactRoute.post('/send', sendMessage);
contactRoute.get('/all', getAllMessages)

export default contactRoute;