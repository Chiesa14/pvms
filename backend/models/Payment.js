import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    reservation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'mobile_money', 'cash'],
        default: 'card',
    },
    transactionId: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
