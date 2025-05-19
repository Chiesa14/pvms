import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const VerificationToken = sequelize.define('VerificationToken', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    expiresAt: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    timestamps: true
});

export default VerificationToken; 