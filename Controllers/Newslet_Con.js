import { Newsletter } from '../Models/Newslet_Mod.js';
import { sendNewsletterEmail } from '../Configs/Email_services.js';

//Subscribe a user to the newsletter
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Add to newsletter list
    await Newsletter.create({ email });

    res.json({ message: 'Subscribed successfully' });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already subscribed' });
    }
    console.error('Subscribe error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

export const sendNewsletter = async (req, res) => {
  try {
    const { subject, htmlContent } = req.body;

    if (!subject || !htmlContent) {
      return res.status(400).json({ message: 'Subject and content are required' });
    }

    // Get all subscribed emails
    const subscribers = await Newsletter.find({});
    const recipientEmails = subscribers.map(sub => sub.email);

    if (recipientEmails.length === 0) {
      return res.status(400).json({ message: 'No subscribers to send to' });
    }

    // Actually send the email
    await sendNewsletterEmail(recipientEmails, subject, htmlContent);

    res.json({ message: 'Newsletter sent successfully' });
  } catch (error) {
    console.error('Send newsletter error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
