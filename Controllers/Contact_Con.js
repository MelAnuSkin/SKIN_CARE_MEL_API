import { Contact } from '../Models/Contact_Mod.js';

export const sendMessage = async (req, res) => {
  try {
    const { fullName, email, inquiryType, subject, message } = req.body;

    if (!fullName || !email || !inquiryType || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = await Contact.create({
      fullName,
      email,
      inquiryType,
      subject,
      message
    });

    res.status(201).json({ message: 'Message sent successfully', contact });
  } catch (error) {
    console.error('Contact form error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


// Admin: Get all contact messages
export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    console.error('Get all messages error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

