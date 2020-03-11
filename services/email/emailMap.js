const mongoose = require('mongoose');
const Comment = mongoose.model('comments');
const Answer = mongoose.model('answers');
const Question = mongoose.model('questions');
const Blog = mongoose.model('blogs');

const {
    getAuthor,
    getQuestionFollowers,
    getSuggestedExperts,
    getTopicFollowers,
    getUserFollowers,
    getSpaceFollowers,
} = require('./emailUtils');

const {
    scores: {
        NEW_ANSWER, UPVOTE_ANSWER, DOWNVOTE_ANSWER, NEW_BLOG, UPVOTE_BLOG, DOWNVOTE_BLOG, NEW_COMMENT, UPVOTE_COMMENT, DOWNVOTE_COMMENT,
    },
} = require('../../utils/constants');

const keys = require('../../config/keys');

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
        ];

        return {
            email: {
                template: 'newEntry',
                locals: {
                    name: author.name,
                    data: question,
                    dataDescription: 'added below question to you.',
                    link: `${keys.emailUrl}question/${_id}`,
                    subject: 'New Question for you',
                },
                recipients,
                user: owner,
            },
            notification: {
                recipients,
                message: `<b>${author.name}</b> added a new question.`,
                link: `/question/${_id}`,
                user: owner,
            },
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
        ];

        return {
            email: {
                template: 'newEntry',
                locals: {
                    name: owner.name,
                    data: answer,
                    dataDescription: 'answered your question.',
                    link: `${keys.emailUrl}answer/${_id}`,
                    subject: 'New Answer to your question',
                },
                recipients,
                user: owner,
            },
            notification: {
                recipients,
                message: `<b>${owner.name}</b> answered a question.`,
                link: `/answer/${_id}`,
                user: owner,
            },
            reputation: {
                user: owner,
                score: NEW_ANSWER,
            },
        };
    },
    followQuestion: async(data) => {
        // Emails to question author
        const {
            _id: questionID,
            follower,
            unfollow,
        } = data;

        const questionFollowers = await getAuthor(questionID, Question);
        const recipients = [ questionFollowers ];

        return {
            email: {
                template: 'followQuestion',
                locals: {
                    name: follower.name,
                    data: unfollow ? 'Unfollowed your question' : 'Started following your question',
                    link: `${keys.emailUrl}question/${questionID}`,
                },
                recipients,
                user: follower,
            },
            notification: {
                recipients,
                message: unfollow ? `<b>${follower.name}</b> unfollowed your question` : `<b>${follower.name}</b> stated following your question.`,
                link: `/question/${questionID}`,
                user: follower,
            },
        };
    },
    upvoteAnswer: async(data) => {
        // Emails to answer author
        const {
            _id: answerID,
            upvoter,
            removeVoting,
            secondaryVoted,
        } = data;

        const answerAuthor = await getAuthor(answerID, Answer);
        const recipients = [ answerAuthor ];
        const secondaryScore = secondaryVoted ? DOWNVOTE_ANSWER * -1 : 0;

        return {
            email: {
                template: 'vote',
                locals: {
                    name: upvoter.name,
                    data: removeVoting ? 'Removed voting for your answer' : 'Upvoted your answer',
                    link: `${keys.emailUrl}answer/${answerID}`,
                    vote: 'Upvote',
                    type: 'Answer',
                },
                recipients,
                user: upvoter,
            },
            notification: {
                recipients,
                message: removeVoting ? `<b>${upvoter.name}</b> removed voting for your answer.` : `<b>${upvoter.name}</b> upvoted your answer.`,
                link: `/answer/${answerID}`,
                user: upvoter,
            },
            reputation: {
                user: answerAuthor,
                score: removeVoting ? -UPVOTE_ANSWER : (UPVOTE_ANSWER + secondaryScore),
            },
        };
    },
    downvoteAnswer: async(data) => {
        // Emails to answer author
        const {
            _id: answerID,
            downvoter,
            removeVoting,
            secondaryVoted,
        } = data;

        const answerAuthor = await getAuthor(answerID, Answer);
        const recipients = [ answerAuthor ];
        const secondaryScore = secondaryVoted ? UPVOTE_ANSWER * -1 : 0;

        return {
            email: {
                template: 'vote',
                locals: {
                    name: downvoter.name,
                    data: removeVoting ? 'Removed voting for your answer' : 'Downvoted your answer',
                    link: `${keys.emailUrl}answer/${answerID}`,
                    vote: 'Downvote',
                    type: 'Answer',
                },
                recipients,
                user: downvoter,
            },
            notification: {
                recipients,
                message: removeVoting ? `<b>${downvoter.name}</b> removed voting for your answer.` : `<b>${downvoter.name}</b> downvoted your answer.`,
                link: `/answer/${answerID}`,
                user: downvoter,
            },
            reputation: {
                user: answerAuthor,
                score: removeVoting ? -DOWNVOTE_ANSWER : (DOWNVOTE_ANSWER + secondaryScore),
            },
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
        const recipients = [ answerAuthor ];

        return {
            email: {
                template: 'newEntry',
                locals: {
                    name: author.name,
                    data: comment,
                    dataDescription: 'added below comment to your answer.',
                    link: `${keys.emailUrl}comment/${_id}`,
                    subject: 'New comment to your answer',
                },
                recipients,
                user: author,
            },
            notification: {
                recipients,
                message: `<b>${author.name}</b> commented on your answer`,
                link: `/comment/${_id}`,
                user: author,
            },
            reputation: {
                user: author,
                score: NEW_COMMENT,
            },
        };
    },
    upvoteComment: async(data) => {
        // Emails to comment author
        const {
            _id: commentID,
            upvoter,
            removeVoting,
            secondaryVoted,
        } = data;

        const author = await getAuthor(commentID, Comment);
        const recipients = [ author ];
        const secondaryScore = secondaryVoted ? DOWNVOTE_COMMENT * -1 : 0;

        return {
            email: {
                template: 'vote',
                locals: {
                    name: upvoter.name,
                    data: removeVoting ? 'Removed voting for your comment' : 'Upvoted your comment',
                    link: `${keys.emailUrl}comment/${commentID}`,
                    vote: 'Upvote',
                    type: 'Comment',
                },
                recipients,
                user: upvoter,
            },
            notification: {
                recipients,
                message: removeVoting ? `<b>${upvoter.name}</b> removed voting for your comment.` : `<b>${upvoter.name}</b> upvoted your comment.`,
                link: `/comment/${commentID}`,
                user: upvoter,
            },
            reputation: {
                user: author,
                score: removeVoting ? -UPVOTE_COMMENT : (UPVOTE_COMMENT + secondaryScore),
            },
        };
    },
    downvoteComment: async(data) => {
        // Emails to comment author
        const {
            _id: commentID,
            downvoter,
            removeVoting,
            secondaryVoted,
        } = data;

        const author = await getAuthor(commentID, Comment);
        const recipients = [ author ];
        const secondaryScore = secondaryVoted ? UPVOTE_COMMENT * -1 : 0;

        return {
            email: {
                template: 'vote',
                locals: {
                    name: downvoter.name,
                    data: removeVoting ? 'Removed voting for your comment' : 'Downvoted your comment',
                    link: `${keys.emailUrl}comment/${commentID}`,
                    vote: 'Downvote',
                    type: 'Comment',
                },
                recipients,
                user: downvoter,
            },
            notification: {
                recipients,
                message: removeVoting ? `<b>${downvoter.name}</b> removed voting for your comment.` : `<b>${downvoter.name}</b> downvoted your comment.`,
                link: `/comment/${commentID}`,
                user: downvoter,
            },
            reputation: {
                user: author,
                score: removeVoting ? -DOWNVOTE_COMMENT : (DOWNVOTE_COMMENT + secondaryScore),
            },
        };
    },
    newBlog: async(data) => {
        // Emails to experts, author followers and topic followers
        const {
            author,
            space,
            title,
            _id,
        } = data;

        const userFollowers = await getUserFollowers(author._id);
        const spaceFollowers = await getSpaceFollowers(space._id);
        const recipients = [
            ...userFollowers,
            ...spaceFollowers,
        ];

        return {
            email: {
                template: 'newEntry',
                locals: {
                    name: author.name,
                    data: title,
                    dataDescription: 'added below blog.',
                    link: `${keys.emailUrl}blog/${_id}`,
                    subject: 'New Blog for you',
                },
                recipients,
                user: author,
            },
            notification: {
                recipients,
                message: `<b>${author.name}</b> added a new blog.`,
                link: `/blog/${_id}`,
                user: author,
            },
            reputation: {
                user: author,
                score: NEW_BLOG,
            },
        };
    },
    upvoteBlog: async(data) => {
        // Emails to comment author
        const {
            _id: blogID,
            upvoter,
            removeVoting,
            secondaryVoted,
        } = data;

        const author = await getAuthor(blogID, Blog);
        const recipients = [ author ];
        const secondaryScore = secondaryVoted ? DOWNVOTE_BLOG * -1 : 0;

        return {
            email: {
                template: 'vote',
                locals: {
                    name: upvoter.name,
                    data: removeVoting ? 'Removed voting for your blog' : 'Upvoted your blog',
                    link: `${keys.emailUrl}blog/${blogID}`,
                    vote: 'Upvote',
                    type: 'Blog',
                },
                recipients,
                user: upvoter,
            },
            notification: {
                recipients,
                message: removeVoting ? `<b>${upvoter.name}</b> removed voting for your blog.` : `<b>${upvoter.name}</b> upvoted your blog.`,
                link: `/blog/${blogID}`,
                user: upvoter,
            },
            reputation: {
                user: author,
                score: removeVoting ? -UPVOTE_BLOG : (UPVOTE_BLOG + secondaryScore),
            },
        };
    },
    downvoteBlog: async(data) => {
        // Emails to answer author
        const {
            _id: blogID,
            downvoter,
            removeVoting,
            secondaryVoted,
        } = data;

        const author = await getAuthor(blogID, Blog);
        const recipients = [ author ];
        const secondaryScore = secondaryVoted ? UPVOTE_BLOG * -1 : 0;

        return {
            email: {
                template: 'vote',
                locals: {
                    name: downvoter.name,
                    data: removeVoting ? 'Removed voting for your blog' : 'Downvoted your blog',
                    link: `${keys.emailUrl}blog/${blogID}`,
                    vote: 'Downvote',
                    type: 'Blog',
                },
                recipients,
                user: downvoter,
            },
            notification: {
                recipients,
                message: removeVoting ? `<b>${downvoter.name}</b> removed voting for your blog.` : `<b>${downvoter.name}</b> downvoted your blog.`,
                link: `/blog/${blogID}`,
                user: downvoter,
            },
            reputation: {
                user: author,
                score: removeVoting ? -DOWNVOTE_BLOG : (DOWNVOTE_BLOG + secondaryScore),
            },
        };
    },
};

module.exports = emailMap;