import express from 'express';
import { sendMessage, getAllMessages, replyToContactMessage } from '../Controllers/Contact_Con.js';
import { adminOnly } from '../Middleware/authen_users.js';

const contactRoute = express.Router();

contactRoute.post('/send', sendMessage);
contactRoute.get('/all', getAllMessages)
contactRoute.post('/reply/:contactId', adminOnly, replyToContactMessage); 

export default contactRoute;