import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Reservation = sequelize.define('Reservation', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    slotId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    startTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    endTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'active', 'revoked', 'cancelled'),
        defaultValue: 'pending',
        allowNull: false,
    },
    vehicleId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Vehicles',
            key: 'id',
        },
    },
}, {
    timestamps: true,
});

export default Reservation;
