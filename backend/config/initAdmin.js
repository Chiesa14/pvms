import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';
import User from '../models/User.js';

export async function initializeAdmin() {
    try {
        // Check for existing admin using both username and email
        const [adminUser, created] = await User.findOrCreate({
            where: {
                [Op.or]: [
                    { email: 'tishok14@gmail.com' },
                    { username: 'admin' }
                ]
            },
            defaults: {
                username: 'admin',
                email: 'tishok14@gmail.com',
                password: await bcrypt.hash('Password123!', 10),
                firstName: 'Admin',
                lastName: 'User',
                role: 'admin',
                isVerified: true,
                phoneNumber: '+250788510570',
                addressStreet: 'Nyabihu',
                addressCity: 'Mukamira City',
                addressState: 'Nyabihu',
                addressPostalCode: '00000',
                addressCountry: 'Rwanda',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });

        if (created) {
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Error initializing admin user:', error);
    }
}