import bcrypt from 'bcryptjs';
import { User } from '../Models/User_Mod.js';

export const seedAdmin = async () => {
  const existingAdmin = await User.findOne({ email: 'jjbaah068@gmail.com' });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      firstName: "James Junior",
      lastName: "Kenn",
      email: "jjbaah068@gmail.com",
      password: hashedPassword,
      role: "admin",
      acceptedTerms: true,
      isVerified: true,
    });
    console.log('Admin user created');
  } else {
    console.log('Admin already exists');
  }
};
