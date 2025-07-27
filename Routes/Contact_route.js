import express from 'express';
import { getAllMessages, sendMessage } from '../Controllers/Contact_Con.js';

const contactRoute = express.Router();

contactRoute.post('/send', sendMessage);
contactRoute.get('/get-all-messages', getAllMessages)

export default contactRoute;