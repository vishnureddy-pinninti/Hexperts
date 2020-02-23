const email = require('./email');
const emailMap = require('./emailMap');

const emailService = async(type, data, options) => {
    const {
        template,
        locals,
        recipients,
    } = await emailMap[type](data,
        options);

    const mailOptions = {
        template,
        locals,
        bcc: recipients.filter((follower) => follower.emailSubscription).map((follower) => follower.email),
    };

    email(mailOptions);
};

module.exports = emailService;