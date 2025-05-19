import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const User = sequelize.define('User', {
    username: {
    type: DataTypes.STRING,
    allowNull: false,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
    type: DataTypes.STRING,
    allowNull: false,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
    },
    password: {
    type: DataTypes.STRING,
    allowNull: false,
      select: false,
    },
    firstName: {
    type: DataTypes.STRING,
      trim: true,
    },
    lastName: {
    type: DataTypes.STRING,
      trim: true,
    },
    phoneNumber: {
    type: DataTypes.STRING,
      trim: true,
    },
  addressStreet: { type: DataTypes.STRING },
  addressCity: { type: DataTypes.STRING },
  addressState: { type: DataTypes.STRING },
  addressPostalCode: { type: DataTypes.STRING },
  addressCountry: { type: DataTypes.STRING },
    role: {
    type: DataTypes.STRING,
    defaultValue: 'user',
    },
    isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    },
    lastLogin: {
    type: DataTypes.DATE,
    },
    profileImage: {
    type: DataTypes.STRING,
  },
}, {
    timestamps: true,
});

export default User;
