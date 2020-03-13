const mongoose = require('mongoose');
const Notification = mongoose.model('notifications');

const notificationService = async(data) => {
    const {
        message,
        link,
        recipients,
        user,
        req,
    } = data;

    const filteredRecipients = recipients.filter((follower) => follower.email !== user.email);
    const notifications = filteredRecipients.map((recipient) => {
        return {
            recipient: recipient._id,
            message,
            link,
        };
    });

    await Notification.insertMany(notifications);
    req.emit('notification', {
        message,
        link,
        recipients: filteredRecipients,
    });
};

module.exports = notificationService;