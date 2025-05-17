// utils/sendNotification.js
import Notification from '../models/notification.js';

const sendNotification = async (userId, message, type = 'other') => {
  await Notification.create({
    user: userId,
    message,
    type,
  });
};

export default sendNotification;
