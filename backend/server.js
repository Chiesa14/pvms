// server.js
import express, { json } from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import setupSwagger from './config/swagger.js';
import { initializeAdmin } from './config/initAdmin.js';
import './models/index.js'; // Import models with associations
import authRoutes from './routes/auth.js';
import protectedRoutes from './routes/protected.js';
import userRoutes from './routes/user.js';
import slotRoutes from './routes/parkingSlot.js';
import reservationRoutes from './routes/reservation.js';
import paymentRoutes from './routes/payment.js';
import notificationRoutes from './routes/notification.js';
import adminRoutes from './routes/admin.js';
import vehicleRoutes from './routes/vehicle.js';
import analyticsRoutes from './routes/analytics.js';
import auditLogRoutes from './routes/auditLogRoutes.js';

const app = express();

// Connect Database
connectDB().then(() => {
    // Initialize admin user after database connection
    initializeAdmin();
});

// Middleware
app.use(cors());
app.use(json());

// Swagger Docs
setupSwagger(app);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/users', userRoutes);
app.use('/api/slots', slotRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audit-logs', auditLogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
