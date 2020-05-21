const email = require('./email');
const emailMap = require('./emailMap');
const notificationService = require('../notifications/notificationService');
const reputationService = require('../reputation/reputationService');
const keys = require('../../config/keys');

const emailService = async(type, data, options) => {
    const {
        email: emailData,
        notification,
        reputation,
    } = await emailMap[type](data,
        options);

    const { origin = keys.emailUrl } = data;
    const {
        template,
        locals,
        recipients,
        type: emailType,
        user,
    } = emailData;

    locals.link = `${origin}${locals.link}`;

    notificationService(notification);

    if (reputation) {
        reputationService(reputation);
    }

    const mailOptions = {
        template,
        locals,
        bcc: recipients
                .filter((recipient) => 
                        recipient.emailSubscription
                        && recipient.emailPreferences
                        && recipient.emailPreferences.indexOf(emailType) > -1 
                        && (recipient.email !== user.email)
                    )
                .map((r) => r.email),
    };

    email(mailOptions);
};

module.exports = emailService;