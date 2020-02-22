const email = require('../utils/email');

const emailMap = {
    newQuestion: (data) => {
        const {
            author,
            question,
            _id,
        } = data;
        return {
            template: 'newQuestion',
            locals: {
                name: author.name,
                question,
                link: `http://localhost:1515/question/${_id}`,
            },
        };
    },
    newAnswer: () => {
        return {
            subject: 'New Answer',
            content: '',
        };
    },
    followQuestion: () => {
        return {
            subject: 'Follow Question',
            content: '',
        };
    },
    unfollowQuestion: () => {
        return {
            subject: 'Unfollow Question',
            content: '',
        };
    },
    upvoteAnswer: () => {
        return {
            subject: 'Upvote Answer',
            content: '',
        };
    },
    downvoteAnswer: () => {
        return {
            subject: 'Downvote Answer',
            content: '',
        };
    },
    commentAnswer: () => {
        return {
            subject: 'Comment Answer',
            content: '',
        };
    },
    upvoteComment: () => {
        return {
            subject: 'Upvote Comment',
            content: '',
        };
    },
    downvoteComment: () => {
        return {
            subject: 'Downvote Comment',
            content: '',
        };
    },
};

const emailService = (recipients, type, data) => {
    const emails = recipients.map((recipient) => `${recipient.name} <${recipient.email}>`);
    const { template, locals } = emailMap[type](data);

    const mailOptions = {
        template,
        locals,
        bcc: emails,
    };

    email(mailOptions);
};

module.exports = emailService;