// controllers/analyticsController.js
import User from '../models/User.js';
import Vehicle from '../models/vehicle.js';
import Reservation from '../models/Reservation.js';
import Payment from '../models/Payment.js';
import ParkingSlot from '../models/ParkingSlot.js';

export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalVehicles = await Vehicle.countDocuments();
        const totalReservations = await Reservation.countDocuments();
        const totalRevenue = await Payment.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalSlots = await ParkingSlot.countDocuments();
        const occupiedSlots = await Reservation.countDocuments({ status: 'active' });

        res.json({
            totalUsers,
            totalVehicles,
            totalReservations,
            totalRevenue: totalRevenue[0]?.total || 0,
            occupancyRate: totalSlots > 0 ? ((occupiedSlots / totalSlots) * 100).toFixed(2) + '%' : '0%'
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve dashboard analytics' });
    }
};
