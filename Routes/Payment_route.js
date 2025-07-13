import express from 'express';
import { protect } from '../Middleware/authen_users.js';
import { initiatePayment, verifyPayment, paystackWebhook} from '../Controllers/Payment_Con.js';

const paymentRoute = express.Router();

paymentRoute.post('/initiate', protect, initiatePayment);
paymentRoute.get('/verify/:reference', protect, verifyPayment);
paymentRoute.post('/webhook', paystackWebhook)

export default paymentRoute;
