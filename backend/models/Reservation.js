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
}, {
    timestamps: true,
});

export default Reservation;
