/* eslint-disable no-console */
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
const Email = require('email-templates');

const transport = nodemailer.createTransport(smtpTransport({
    host: 'in-smtprelay.ingrnet.com',
    tls: { rejectUnauthorized: false },
}));

const emailConfig = new Email({
    preview: false,
    message: {
        from: 'Expertise Exchange Platform <no-reply-eep@hexagon.com>',
    },
    // uncomment below to send emails in development/test env:
    send: true,
    transport,
});

const email = async(mailOptions) => {
    const {
        template,
        locals,
        bcc,
    } = mailOptions;

    try {
        await emailConfig
            .send({
                template,
                message: {
                    to: 'Expertise Exchange Platform <no-reply-eep@hexagon.com>',
                    bcc,
                },
                locals,
            });
    }
    catch (e) {
        console.error(e);
    }
};

module.exports = email;