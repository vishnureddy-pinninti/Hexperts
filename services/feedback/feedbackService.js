const email = require('../email/email');

const feedbackService = async(data) => {
    const {
        subject,
        description,
        user
    } = data;
    const mailOptions = {
        template: 'feedback',
        locals: {
            name: user.name,
            description,
            dataDescription: 'added new feedback.',
            subject: 'Hexperts Feedback: '+subject,
        },
        from: user.email,
        to:'mishelpdesk@ingrnet.com'
    };

    email(mailOptions);
};

module.exports = feedbackService;
