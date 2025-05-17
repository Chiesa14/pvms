// models/notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    type: {
        type: String,
        enum: ['reservation', 'payment', 'admin', 'otp', 'other'],
        default: 'other',
    },
}, {
    timestamps: true,
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
