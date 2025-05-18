// controllers/userController.js
import User from '../models/User.js';

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
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
