import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'ParkingSlot', required: true },
    vehicleNumber: { type: String, required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'completed'],
        default: 'active',
    },
}, { timestamps: true });

export default mongoose.model('Reservation', reservationSchema);
