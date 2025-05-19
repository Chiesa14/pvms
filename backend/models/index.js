import User from './User.js';
import VerificationToken from './VerificationToken.js';
import Reservation from './Reservation.js';
import ParkingSlot from './ParkingSlot.js';
import Notification from './Notification.js';

// Define associations
User.hasMany(VerificationToken, {
    foreignKey: 'userId',
    as: 'verificationTokens'
});

VerificationToken.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

// Reservation associations
User.hasMany(Reservation, {
    foreignKey: 'userId',
    as: 'reservations'
});

Reservation.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

ParkingSlot.hasMany(Reservation, {
    foreignKey: 'slotId',
    as: 'reservations'
});

Reservation.belongsTo(ParkingSlot, {
    foreignKey: 'slotId',
    as: 'slot'
});

// Notification associations
User.hasMany(Notification, {
    foreignKey: 'userId',
    as: 'notifications'
});

Notification.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

export {
    User,
    VerificationToken,
    Reservation,
    ParkingSlot,
    Notification
}; 