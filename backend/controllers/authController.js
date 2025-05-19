import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import VerificationToken from '../models/VerificationToken.js';
import sendEmail from '../utils/sendEmail.js';
import { sendVerificationEmail } from '../utils/emailService.js';

// Generate verification token
const generateVerificationToken = () => {
    return crypto.randomBytes(32).toString('hex');
};

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
            isVerified: false
        });

        // Generate verification token
        const verificationToken = generateVerificationToken();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // Token expires in 24 hours

        // Save verification token
        await VerificationToken.create({
            userId: newUser.id,
            token: verificationToken,
            expiresAt
        });

        // Send verification email
        await sendVerificationEmail(email, verificationToken);

        res.status(201).json({ message: 'Registration successful. Please check your email to verify your account.' });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        // Find verification token
        const verificationToken = await VerificationToken.findOne({
            where: { token },
            include: [{
                model: User,
                as: 'user'
            }]
        });

        if (!verificationToken) {
            return res.status(400).json({ message: 'Invalid verification token' });
        }

        // Check if token is expired
        if (verificationToken.expiresAt < new Date()) {
            await verificationToken.destroy();
            return res.status(400).json({ message: 'Verification token has expired' });
        }

        // Update user verification status
        await User.update(
            { isVerified: true },
            { where: { id: verificationToken.userId } }
        );

        // Delete used token
        await verificationToken.destroy();

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        console.error('Email verification error:', error);
        res.status(500).json({ message: 'Error verifying email' });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if user is verified
        if (!user.isVerified) {
            return res.status(400).json({ message: 'Please verify your email before logging in' });
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
        console.error('Login error:', error);
        res.status(500).json({ message: 'Error logging in' });
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
