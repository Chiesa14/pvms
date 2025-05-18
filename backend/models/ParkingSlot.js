import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const ParkingSlot = sequelize.define('ParkingSlot', {
  slotNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  zone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  floor: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
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
