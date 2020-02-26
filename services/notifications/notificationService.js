const mongoose = require('mongoose');
const Notification = mongoose.model('notifications');

const notificationService = async(data) => {
    const {
        message,
        link,
        recipients,
        user,
    } = data;

    const notifications = recipients.filter((follower) => follower.email !== user.email).map((recipient) => {
        return {
            recipient: recipient._id,
            message,
            link,
        };
    });

    await Notification.insertMany(notifications);
};

module.exports = notificationService;