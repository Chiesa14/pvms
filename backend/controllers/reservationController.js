import Reservation from '../models/Reservation.js';
import ParkingSlot from '../models/ParkingSlot.js';
import { Op } from 'sequelize';

export const createReservation = async (req, res) => {
    try {
        const { slotId, startTime, endTime } = req.body;

        if (!slotId || !startTime || !endTime) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (new Date(startTime) >= new Date(endTime)) {
            return res.status(400).json({ message: 'End time must be after start time' });
        }

        // Check if slot exists
        const existingSlot = await ParkingSlot.findByPk(slotId);
        if (!existingSlot) {
            return res.status(404).json({ message: 'Parking slot not found' });
        }

        // Check for overlapping reservation
        const overlapping = await Reservation.findOne({
            where: {
                slotId,
                [Op.or]: [
                    {
                        startTime: { [Op.lt]: endTime },
                        endTime: { [Op.gt]: startTime }
                    }
                ]
            }
        });

        if (overlapping) {
            return res.status(409).json({ message: 'Slot already reserved for this time' });
        }

        const reservation = await Reservation.create({
            userId: req.user.userId,
            slotId,
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
        const reservations = await Reservation.findAll({
            where: { userId: req.user.userId }
        });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const cancelReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findOne({
            where: {
                id: req.params.id,
                userId: req.user.userId,
            }
        });

        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        reservation.status = 'cancelled';
        await reservation.save();

        // await sendNotification(req.user.userId, 'Your reservation was successfully removed!', 'reservation');

        res.status(200).json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
