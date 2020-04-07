const mongoose = require('mongoose');
const Notification = mongoose.model('notifications');

const notificationService = async(data) => {
    const {
        message,
        link,
        recipients,
        user,
        req,
        type,
    } = data;

    const filteredRecipients = recipients
        .filter((follower) => follower.email !== user.email)
        .map((r) => { return { user: r._id }; });

    const uniqueRecipients = filteredRecipients.reduce((unique, o) => {
        if (!unique.some((obj) => obj.user.equals(o.user))) {
            unique.push(o);
        }
        return unique;
    }, []);

    if (uniqueRecipients.length) {
        const notification = new Notification({
            message,
            link,
            recipients: uniqueRecipients,
            type,
        });
    
        await notification.save();
        req.emit('notification', notification);
    }
};

module.exports = notificationService;