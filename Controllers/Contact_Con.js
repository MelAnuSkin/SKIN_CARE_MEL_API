import { Contact } from '../Models/Contact_Mod.js';
import { sendAdminReplyEmail } from '../Configs/Email_services.js';
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

//admin replies to contact messages
export const replyToContactMessage = async (req, res) => {
  try {
    const { contactId } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const contact = await Contact.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: "Contact message not found" });
    }

    // Send email reply
    await sendAdminReplyEmail(
      contact.email,
      contact.subject,
      contact.message,
      replyMessage
    );

    // Optional: mark the message as replied or store the reply in DB
    contact.adminReply = replyMessage;
    contact.repliedAt = new Date();
    await contact.save();

    res.status(200).json({ message: "Reply sent successfully", contact });
  } catch (error) {
    console.error("Admin reply error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};