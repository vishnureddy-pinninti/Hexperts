const email = require('./email');
const emailMap = require('./emailMap');
const notificationService = require('../notifications/notificationService');

const emailService = async(type, data, options) => {
    const {
        email: {
            template,
            locals,
            recipients,
            user,
        },
        notification,
    } = await emailMap[type](data,
        options);

    notificationService(notification);

    const mailOptions = {
        template,
        locals,
        bcc: recipients.filter((follower) => follower.emailSubscription && (follower.email !== user.email)).map((follower) => follower.email),
    };

    email(mailOptions);
};

module.exports = emailService;