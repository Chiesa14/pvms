import bcrypt from 'bcryptjs';
import User from '../models/User.js';

export async function initializeAdmin() {
    try {
        // Check if admin already exists
        const adminExists = await User.findOne({
            where: { email: 'admin@gmail.com' }
        });

        if (adminExists) {
            console.log('Admin user already exists');
            return;
        }

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Password123!', salt);

        await User.create({
            username: 'admin',
            email: 'admin@gmail.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            isVerified: true,
            phoneNumber: '+250788510570',
            addressStreet: 'Nyabihu',
            addressCity: 'Mukamira City',
            addressState: 'Nyabihu',
            addressPostalCode: '00000',
            addressCountry: 'Rwanda'
        });

        console.log('Admin user created successfully');
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
} 