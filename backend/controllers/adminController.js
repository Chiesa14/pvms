import User from '../models/User.js';
import Reservation from '../models/Reservation.js';
import Payment from '../models/Payment.js';

// GET /api/admin/users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// PATCH /api/admin/users/:id/role
export const updateUserRole = async (req, res) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!['admin', 'user', 'staff'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
    }

    try {
        const [updatedRows, [user]] = await User.update(
            { role },
            { where: { id }, returning: true }
        );
        if (!user) return res.status(404).json({ message: 'User not found' });
        const userWithoutPassword = user.get({ plain: true });
        delete userWithoutPassword.password;
        res.status(200).json(userWithoutPassword);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deleted = await User.destroy({ where: { id } });
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
};
