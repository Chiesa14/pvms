import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import sendEmail from '../utils/sendEmail.js';

export const registerUser = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            firstName,
            lastName,
            phoneNumber,
            addressStreet,
            addressCity,
            addressState,
            addressPostalCode,
            addressCountry,
            role,
        } = req.body;

        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            firstName,
            lastName,
            phoneNumber,
            addressStreet,
            addressCity,
            addressState,
            addressPostalCode,
            addressCountry,
            role,
        });

        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

        const otpEntry = await Otp.create({
            userId: user.id,
            code: otpCode,
            expiresAt
        });

        await sendEmail(email, 'Your OTP Code', `Your OTP code is ${otpCode}`);

        res.status(200).json({ message: 'OTP sent to email' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        const otpEntry = await Otp.findOne({ where: { userId: user.id, code: otp } });
        if (!otpEntry) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }
        if (otpEntry.expiresAt < new Date()) {
            await otpEntry.destroy();
            return res.status(400).json({ message: 'OTP expired' });
        }
        await otpEntry.destroy();
        user.lastLogin = new Date();
        await user.save();
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
