import Reservation from '../models/Reservation.js';
import ParkingSlot from '../models/ParkingSlot.js';

export const createReservation = async (req, res) => {
    try {
        const { slot, vehicleNumber, startTime, endTime } = req.body;

        if (!slot || !vehicleNumber || !startTime || !endTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (new Date(startTime) >= new Date(endTime)) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        // Check if slot exists
        const existingSlot = await ParkingSlot.findById(slot);
        if (!existingSlot) {
            return res.status(404).json({ message: 'Parking slot not found' });
        }

        // Check for overlapping reservation
        const overlapping = await Reservation.findOne({
            slot,
            status: 'active',
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
            ],
        });

        if (overlapping) {
            return res.status(409).json({ message: 'Slot already reserved for this time' });
        }

        const reservation = await Reservation.create({
            user: req.user.id,
            slot,
            vehicleNumber,
            startTime,
            endTime,
        });

        res.status(201).json(reservation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find({ user: req.user.id }).populate('slot');
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            _id: req.params.id,
            user: req.user.id,
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        await sendNotification(user._id, 'Your reservation was successfully removed!', 'reservation');


        res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
