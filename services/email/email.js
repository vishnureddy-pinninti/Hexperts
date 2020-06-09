/* eslint-disable no-console */
const nodemailer = require('nodemailer');
const Email = require('email-templates');
const { onlyUnique } = require('../../utils/common');

const transport = nodemailer.createTransport({
    host: 'in-smtprelay.ingrnet.com',
    port: 25,
    secure: false,
    tls: { rejectUnauthorized: false },
});

const emailConfig = new Email({
    preview: false,
    message: {
        from: 'Hexperts <noreply-hexperts@hexagon.com>',
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
    const uniqueRecipients = onlyUnique(bcc);

    try {
        await emailConfig
            .send({
                template,
                message: {
                    to: 'Hexperts <noreply-hexperts@hexagon.com>',
                    bcc: uniqueRecipients,
                },
                locals,
            });
    }
    catch (e) {
        console.error(e);
    }
};

module.exports = email;