// controllers/userController.js
import User from '../models/User.js';
import {
  createPaginationOptions,
  createWhereClause,
  createPaginationResponse
} from '../utils/pagination.js';

// @desc    Get current user profile
export const getMyProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.userId, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update current user profile
export const updateMyProfile = async (req, res) => {
  try {
    const updates = req.body;
    const [updatedRows, [user]] = await User.update(updates, {
      where: { id: req.user.userId },
      returning: true,
      individualHooks: true,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const userWithoutPassword = user.get({ plain: true });
    delete userWithoutPassword.password;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Admin get all users
export const getAllUsers = async (req, res) => {
  try {
    const { page, limit, offset } = createPaginationOptions(req.query);

    const where = createWhereClause(req.query, {
      searchFields: ['name', 'email', 'phone'],
      statusField: 'status'
    });

    const { count, rows } = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password'] },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json(createPaginationResponse(count, page, limit, rows));
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
