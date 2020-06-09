const email = require('./email');
const emailMap = require('./emailMap');
const notificationService = require('../notifications/notificationService');
const reputationService = require('../reputation/reputationService');
const keys = require('../../config/keys');
const { notMentions } = require('./emailUtils');

const mentionMap = {
    newQuestion: 'question',
    editQuestion: 'question',
    newAnswer: 'answer',
    editAnswer: 'answer',
    newComment: 'comment',
    newPost: 'post',
    editPost: 'post',
}

const emailService = async(type, data, options) => {
    const {
        email: emailData,
        notification,
        reputation,
    } = await emailMap[type](data,
        options);

    const {
        origin = keys.emailUrl,
        userMentions = [],
        _id,
        req,
    } = data;
    const {
        template,
        locals,
        recipients,
        type: emailType,
        user,
    } = emailData;
    const recipientsWIthoutMentions = notMentions(recipients, userMentions);
    const mentionType = mentionMap[emailType];

    if (userMentions.length && mentionType) {
        emailService('userMention', {
            author: user,
            data: locals.data,
            id: _id,
            recipients: userMentions,
            type: mentionType,
            mailType: type,
            req,
            origin,
        });
    }

    locals.link = `${origin}${locals.link}`;
    notification.recipients = recipientsWIthoutMentions;

    notificationService(notification);

    if (reputation) {
        reputationService(reputation);
    }

    const mailOptions = {
        template,
        locals,
        bcc: recipientsWIthoutMentions
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