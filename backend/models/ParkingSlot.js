import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ParkingSlot = sequelize.define('ParkingSlot', {
  slotNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  floor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('available', 'occupied', 'reserved', 'maintenance'),
    defaultValue: 'available',
    allowNull: false,
  },
  isOccupied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  reservedBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  timestamps: true,
});

export default ParkingSlot;
