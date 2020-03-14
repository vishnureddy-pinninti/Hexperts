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

    const filteredRecipients = recipients.filter((follower) => follower.email !== user.email).map((r) => { return { user: r._id }; });

    const notification = new Notification({
        message,
        link,
        recipients: filteredRecipients,
    });

    await notification.save();
    req.emit('notification', notification);
};

module.exports = notificationService;