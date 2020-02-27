const email = require('./email');
const emailMap = require('./emailMap');
const notificationService = require('../notifications/notificationService');
const reputationService = require('../reputation/reputationService');

const emailService = async(type, data, options) => {
    const {
        email: emailData,
        notification,
        reputation,
    } = await emailMap[type](data,
        options);


    const {
        template,
        locals,
        recipients,
        user,
    } = emailData;

    notificationService(notification);

    if (reputation) {
        reputationService(reputation);
    }

    const mailOptions = {
        template,
        locals,
        bcc: recipients.filter((follower) => follower.emailSubscription && (follower.email !== user.email)).map((follower) => follower.email),
    };

    email(mailOptions);
};

module.exports = emailService;