// models/notification.js
import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Notification = sequelize.define('Notification', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'general'
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
}, {
    timestamps: true,
});

export default Notification;
