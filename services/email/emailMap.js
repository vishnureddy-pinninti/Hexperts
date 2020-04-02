const mongoose = require('mongoose');
const Comment = mongoose.model('comments');
const Answer = mongoose.model('answers');
const Question = mongoose.model('questions');
const Post = mongoose.model('posts');
const User = mongoose.model('users');

const {
    getAuthor,
    getQuestionFollowers,
    getSuggestedExperts,
    getTopicFollowers,
    getUserFollowers,
    getBlogFollowers,
} = require('./emailUtils');

const {
    scores: {
        NEW_ANSWER, UPVOTE_ANSWER, DOWNVOTE_ANSWER, NEW_POST, UPVOTE_POST, DOWNVOTE_POST, NEW_COMMENT, UPVOTE_COMMENT, DOWNVOTE_COMMENT,
    },
    notificationTypes: {
        QUESTION_NOTIFICATION, ANSWER_NOTIFICATION, COMMENT_NOTIFICATION, POST_NOTIFICATION, USER_NOTIFICATION,
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
            req,
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
                req,
                type: QUESTION_NOTIFICATION,
            },
        };
    },
    newAnswer: async(data, options) => {
        // Emails to question author, question followers and user followers
        const {
            answer,
            _id,
            questionID,
            req,
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
                req,
                type: ANSWER_NOTIFICATION,
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
            req,
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
                message: unfollow ? `<b>${follower.name}</b> unfollowed your question` : `<b>${follower.name}</b> started following your question.`,
                link: `/question/${questionID}`,
                user: follower,
                req,
                type: QUESTION_NOTIFICATION,
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
            req,
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
                req,
                type: ANSWER_NOTIFICATION,
            },
            reputation: {
                user: answerAuthor,
                score: removeVoting ? -UPVOTE_ANSWER : (UPVOTE_ANSWER + secondaryScore),
                voteCount: removeVoting ? -1 : 1,
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
            req,
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
                req,
                type: ANSWER_NOTIFICATION,
            },
            reputation: {
                user: answerAuthor,
                score: removeVoting ? -DOWNVOTE_ANSWER : (DOWNVOTE_ANSWER + secondaryScore),
            },
        };
    },
    newComment: async(data) => {
        // Emails to answer/post author
        const {
            _id,
            author,
            comment,
            target,
            targetID,
            req,
        } = data;

        const targetName = target === 'posts' ? 'post': 'answer';
        const model = target === 'posts' ? Post: Answer;

        const answerAuthor = await getAuthor(targetID, model);
        const recipients = [ answerAuthor ];

        return {
            email: {
                template: 'newEntry',
                locals: {
                    name: author.name,
                    data: comment,
                    dataDescription: `added below comment to your ${targetName}.`,
                    link: `${keys.emailUrl}comment/${_id}`,
                    subject: `New comment to your ${targetName}`,
                },
                recipients,
                user: author,
            },
            notification: {
                recipients,
                message: `<b>${author.name}</b> commented on your ${targetName}`,
                link: `/comment/${_id}`,
                user: author,
                req,
                type: COMMENT_NOTIFICATION,
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
            req,
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
                req,
                type: COMMENT_NOTIFICATION,
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
            req,
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
                req,
                type: COMMENT_NOTIFICATION,
            },
            reputation: {
                user: author,
                score: removeVoting ? -DOWNVOTE_COMMENT : (DOWNVOTE_COMMENT + secondaryScore),
                voteCount: secondaryVoted ? -1 : 0,
            },
        };
    },
    newPost: async(data) => {
        // Emails to experts, author followers and topic followers
        const {
            author,
            topics,
            title,
            _id,
            req,
        } = data;

        const userFollowers = await getUserFollowers(author._id);
        const topicFollowers = await getTopicFollowers(topics.map((t) => t._id));
        const recipients = [
            ...userFollowers,
            ...topicFollowers,
        ];

        return {
            email: {
                template: 'newEntry',
                locals: {
                    name: author.name,
                    data: title,
                    dataDescription: 'added below post.',
                    link: `${keys.emailUrl}post/${_id}`,
                    subject: 'New Post for you',
                },
                recipients,
                user: author,
            },
            notification: {
                recipients,
                message: `<b>${author.name}</b> added a new post.`,
                link: `/post/${_id}`,
                user: author,
                req,
                type: POST_NOTIFICATION,
            },
            reputation: {
                user: author,
                score: NEW_POST,
            },
        };
    },
    upvotePost: async(data) => {
        // Emails to comment author
        const {
            _id: postID,
            upvoter,
            removeVoting,
            secondaryVoted,
            req,
        } = data;

        const author = await getAuthor(postID, Post);
        const recipients = [ author ];
        const secondaryScore = secondaryVoted ? DOWNVOTE_POST * -1 : 0;

        return {
            email: {
                template: 'vote',
                locals: {
                    name: upvoter.name,
                    data: removeVoting ? 'Removed voting for your post' : 'Upvoted your post',
                    link: `${keys.emailUrl}post/${postID}`,
                    vote: 'Upvote',
                    type: 'Post',
                },
                recipients,
                user: upvoter,
            },
            notification: {
                recipients,
                message: removeVoting ? `<b>${upvoter.name}</b> removed voting for your post.` : `<b>${upvoter.name}</b> upvoted your post.`,
                link: `/post/${postID}`,
                user: upvoter,
                req,
                type: POST_NOTIFICATION,
            },
            reputation: {
                user: author,
                score: removeVoting ? -UPVOTE_POST : (UPVOTE_POST + secondaryScore),
                voteCount: removeVoting ? -1 : 1,
            },
        };
    },
    downvotePost: async(data) => {
        // Emails to answer author
        const {
            _id: postID,
            downvoter,
            removeVoting,
            secondaryVoted,
            req,
        } = data;

        const author = await getAuthor(postID, Post);
        const recipients = [ author ];
        const secondaryScore = secondaryVoted ? UPVOTE_POST * -1 : 0;

        return {
            email: {
                template: 'vote',
                locals: {
                    name: downvoter.name,
                    data: removeVoting ? 'Removed voting for your post' : 'Downvoted your post',
                    link: `${keys.emailUrl}post/${postID}`,
                    vote: 'Downvote',
                    type: 'Post',
                },
                recipients,
                user: downvoter,
            },
            notification: {
                recipients,
                message: removeVoting ? `<b>${downvoter.name}</b> removed voting for your post.` : `<b>${downvoter.name}</b> downvoted your post.`,
                link: `/post/${postID}`,
                user: downvoter,
                req,
                type: POST_NOTIFICATION,
            },
            reputation: {
                user: author,
                score: removeVoting ? -DOWNVOTE_POST : (DOWNVOTE_POST + secondaryScore),
                voteCount: secondaryVoted ? -1 : 0,
            },
        };
    },
    followUser: async(data) => {
        // Emails to user
        const {
            _id: userID,
            follower,
            unfollow,
            req,
        } = data;

        const user = await User.findById(mongoose.Types.ObjectId(userID));
        const recipients = [ user ];

        return {
            email: {
                template: 'followQuestion',
                locals: {
                    name: follower.name,
                    data: unfollow ? 'Unfollowed you' : 'Started following you',
                    link: `${keys.emailUrl}profile/${follower._id}`,
                },
                recipients,
                user: follower,
            },
            notification: {
                recipients,
                message: unfollow ? `<b>${follower.name}</b> Unfollowed you` : `<b>${follower.name}</b> started following you.`,
                link: `/profile/${follower._id}`,
                user: follower,
                req,
                type: USER_NOTIFICATION,
            },
        };
    },
};

module.exports = emailMap;