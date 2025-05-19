import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const AuditLog = sequelize.define('AuditLog', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    tableName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    recordId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    action: {
        type: DataTypes.ENUM('INSERT', 'UPDATE', 'DELETE'),
        allowNull: false
    },
    oldData: {
        type: DataTypes.JSON,
        allowNull: true
    },
    newData: {
        type: DataTypes.JSON,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

export { AuditLog }; 