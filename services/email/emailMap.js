const mongoose = require('mongoose');
const Comment = mongoose.model('comments');
const Answer = mongoose.model('answers');

const {
    getAuthor,
    getQuestionFollowers,
    getSuggestedExperts,
    getTopicFollowers,
    getUserFollowers,
} = require('./emailUtils');

const emailMap = {
    newQuestion: async(data, options) => {
        // Emails to experts, author followers and topic followers
        const {
            author,
            question,
            _id,
        } = data;

        const {
            author: owner,
            suggestedExperts,
            topics,
        } = options;

        const userFollowers = await getUserFollowers(owner._id);
        const topicFollowers = await getTopicFollowers(topics);
        const experts = await getSuggestedExperts(suggestedExperts);
        const recipients = [
            ...experts,
            ...userFollowers,
            ...topicFollowers,
        ].filter((recipient) => recipient !== `${owner.name} <${owner.email}>`);

        return {
            template: 'newEntry',
            locals: {
                name: author.name,
                data: question,
                dataDescription: 'added below question to you.',
                link: `http://localhost:1515/question/${_id}`,
                subject: 'New Question for you',
            },
            recipients,
        };
    },
    newAnswer: async(data, options) => {
        // Emails to question author, question followers and user followers
        const {
            answer,
            _id,
            questionID,
        } = data;

        const {
            author: owner,
        } = options;

        const questionFollowers = await getQuestionFollowers(questionID);
        const userFollowers = await getUserFollowers(owner._id);

        const recipients = [
            ...questionFollowers,
            ...userFollowers,
        ].filter((recipient) => recipient !== `${owner.name} <${owner.email}>`);

        return {
            template: 'newEntry',
            locals: {
                name: owner.name,
                data: answer,
                dataDescription: 'answered your question.',
                link: `http://localhost:1515/answer/${_id}`,
                subject: 'New Answer to your question',
            },
            recipients,
        };
    },
    followQuestion: async(data) => {
        // Emails to question author
        const {
            _id: questionID,
            follower,
            unfollow,
        } = data;

        const questionFollowers = await getQuestionFollowers(questionID, true);

        const recipients = [ questionFollowers ].filter((recipient) => recipient !== `${follower.name} <${follower.email}>`);

        return {
            template: 'followQuestion',
            locals: {
                name: follower.name,
                data: unfollow ? 'Unfollowed your question' : 'Started following your question',
                link: `http://localhost:1515/question/${questionID}`,
            },
            recipients,
        };
    },
    upvoteAnswer: async(data) => {
        // Emails to answer author
        const {
            _id: answerID,
            upvoter,
            removeVoting,
        } = data;

        const answerAuthor = await getAuthor(answerID, Answer);

        const recipients = [ answerAuthor ].filter((recipient) => recipient !== `${upvoter.name} <${upvoter.email}>`);

        return {
            template: 'vote',
            locals: {
                name: upvoter.name,
                data: removeVoting ? 'Removed voting for your answer' : 'Upvoted your answer',
                link: `http://localhost:1515/answer/${answerID}`,
                vote: 'Upvote',
                type: 'Answer',
            },
            recipients,
        };
    },
    downvoteAnswer: async(data) => {
        // Emails to answer author
        const {
            _id: answerID,
            downvoter,
            removeVoting,
        } = data;

        const answerAuthor = await getAuthor(answerID, Answer);

        const recipients = [ answerAuthor ].filter((recipient) => recipient !== `${downvoter.name} <${downvoter.email}>`);

        return {
            template: 'vote',
            locals: {
                name: downvoter.name,
                data: removeVoting ? 'Removed voting for your answer' : 'Downvoted your answer',
                link: `http://localhost:1515/answer/${answerID}`,
                vote: 'Downvote',
                type: 'Answer',
            },
            recipients,
        };
    },
    newComment: async(data) => {
        // Emails to answer author
        const {
            _id,
            author,
            comment,
            targetID,
        } = data;

        const answerAuthor = await getAuthor(targetID, Answer);

        const recipients = [ answerAuthor ].filter((recipient) => recipient !== `${author.name} <${author.email}>`);

        return {
            template: 'newEntry',
            locals: {
                name: author.name,
                data: comment,
                dataDescription: 'added below comment to your answer.',
                link: `http://localhost:1515/comment/${_id}`,
                subject: 'New comment to your answer',
            },
            recipients,
        };
    },
    upvoteComment: async(data) => {
        // Emails to comment author
        const {
            _id: commentID,
            upvoter,
            removeVoting,
        } = data;

        const author = await getAuthor(commentID, Comment);

        const recipients = [ author ].filter((recipient) => recipient !== `${upvoter.name} <${upvoter.email}>`);

        return {
            template: 'vote',
            locals: {
                name: upvoter.name,
                data: removeVoting ? 'Removed voting for your comment' : 'Upvoted your comment',
                link: `http://localhost:1515/comment/${commentID}`,
                vote: 'Upvote',
                type: 'Comment',
            },
            recipients,
        };
    },
    downvoteComment: async(data) => {
        // Emails to comment author
        const {
            _id: commentID,
            downvoter,
            removeVoting,
        } = data;

        const author = await getAuthor(commentID, Comment);

        const recipients = [ author ].filter((recipient) => recipient !== `${downvoter.name} <${downvoter.email}>`);

        return {
            template: 'vote',
            locals: {
                name: downvoter.name,
                data: removeVoting ? 'Removed voting for your comment' : 'Downvoted your comment',
                link: `http://localhost:1515/comment/${commentID}`,
                vote: 'Downvote',
                type: 'Comment',
            },
            recipients,
        };
    },
};

module.exports = emailMap;