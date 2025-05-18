import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Otp = sequelize.define('Otp', {
  code: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true,
});

export default Otp;
