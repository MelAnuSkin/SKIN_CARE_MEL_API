import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  fullName:    { type: String, required: true },
  email:       { type: String, required: true },
  inquiryType: { type: String, required: true },
  subject:     { type: String, required: true },
  message:     { type: String, required: true },
  adminReply: {
    type: String,
    default: null 
  },
  repliedAt: {
    type: Date
  },
  createdAt: { type: Date, default: Date.now }
});

export const Contact = mongoose.model('Contact', contactSchema);
