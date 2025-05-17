import Payment from '../models/Payment.js';
import Reservation from '../models/Reservation.js';

// Mock payment gateway function
const simulatePaymentGateway = async () => {
    return {
        success: true,
        transactionId: 'TXN-' + Math.floor(Math.random() * 1000000000),
    };
};

// Initiate a payment
export const initiatePayment = async (req, res) => {
    try {
        const { reservationId, paymentMethod } = req.body;
        const reservation = await Reservation.findById(reservationId);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        if (reservation.status === 'paid') {
            return res.status(400).json({ message: 'Reservation already paid' });
        }

        const payment = new Payment({
            user: req.user._id,
            reservation: reservation._id,
            amount: reservation.amount,
            paymentMethod,
        });

        const paymentResult = await simulatePaymentGateway();

        if (paymentResult.success) {
            payment.status = 'completed';
            payment.transactionId = paymentResult.transactionId;

            reservation.status = 'paid';
            await reservation.save();
        } else {
            payment.status = 'failed';
        }

        await payment.save();

        res.status(200).json({
            message: payment.status === 'completed' ? 'Payment successful' : 'Payment failed',
            payment,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const verifyPayment = async (req, res) => {
    try {
        const { transactionId } = req.body;

        const payment = await Payment.findOne({ transactionId });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ payment });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};