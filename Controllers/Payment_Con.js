import axios from 'axios';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { Order } from '../Models/Order_Mod.js';
import { sendMailWithPaymentLink } from '../Configs/Email_services.js';

dotenv.config();

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// initialize payment 

export const initiatePayment = async (req, res) => {
  try {
    const { _id: userId, email: userEmail, fullName, username } = req.user;
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: 'Order ID is required' });
    }

    const order = await Order.findOne({ _id: orderId, user: userId, paymentStatus: 'pending' });
    if (!order) {
      return res.status(404).json({ message: 'Pending order not found' });
    }

    const amountInKobo = order.totalAmount * 100;

    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        amount: amountInKobo,
        email: userEmail,
        metadata: { orderId: order._id }
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const { authorization_url, reference } = response.data.data;

    await sendMailWithPaymentLink(
      userEmail,
      fullName || username || 'Valued customer',
      authorization_url
    );

    res.status(200).json({ 
      message: "Payment link has been sent to your email.",
      reference,
      paymentUrl: authorization_url
    });

  } catch (error) {
    console.error('Payment initiation failed:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Failed to initiate payment' });
  }
};

// Manual payment verification
export const verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;

    if (!reference) {
      return res.status(400).json({ message: 'Transaction reference is required' });
    }

    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
        }
      }
    );

    const paymentData = response.data.data;

    if (paymentData.status === 'success') {
      const orderId = paymentData.metadata?.orderId;

      if (orderId) {
        // Mark order as paid in DB
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'paid';
          order.paidAt = new Date();
          await order.save();
        }
      }

      return res.json({
        message: 'Payment verified successfully',
        data: paymentData
      });
    } else {
      return res.status(400).json({ message: 'Payment not successful' });
    }
  } catch (error) {
    console.error('Payment verification failed:', error?.response?.data || error.message);
    res.status(500).json({ message: 'Failed to verify payment' });
  }
};

// Automate payment with webhook
export const paystackWebhook = async (req, res) => {
  try {
    const hash = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== req.headers['x-paystack-signature']) {
      return res.status(401).json({ message: 'Invalid signature' });
    }

    const event = req.body;

    if (event.event === 'charge.success') {
      const data = event.data;
      const metadata = data.metadata;
      const orderId = metadata?.orderId;

      if (orderId) {
        const order = await Order.findById(orderId);
        if (order && order.paymentStatus !== 'paid') {
          order.paymentStatus = 'paid';
          order.paidAt = new Date();
          await order.save();
          console.log('Order marked as paid from webhook:', order._id);
        }
      }
    }

    // Always respond 200 so Paystack doesn't retry
    res.sendStatus(200);
  } catch (error) {
    console.error('Webhook processing failed:', error.message);
    res.sendStatus(500);
  }
};
