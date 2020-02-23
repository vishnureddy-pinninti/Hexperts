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
        bcc: recipients,
    };

    email(mailOptions);
};

module.exports = emailService;