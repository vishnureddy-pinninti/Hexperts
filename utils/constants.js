module.exports = {
    PORT: 1515,
    errors: {
        ANSWER_NOT_FOUND: 'Answer not found',
        BLOG_NOT_FOUND: 'Blog Not Found',
        COMMENT_NOT_FOUND: 'Comment not found',
        CRAWLER_NOT_FOUND: 'Crawler not found',
        NOTIFICATION_NOT_FOUND: 'Notification Not Found',
        POST_NOT_FOUND: 'Post Not Found',
        QUESTION_NOT_FOUND: 'Question not found',
        TOPIC_NOT_FOUND: 'Topic Not Found',
        UNAUTHORIZED: 'UNAUTHORIZED',
        USER_NOT_FOUND: 'User Not Found',
    },
    scores: {
        NEW_ANSWER: 10,
        UPVOTE_ANSWER: 2,
        DOWNVOTE_ANSWER: -1,
        NEW_POST: 10,
        UPVOTE_POST: 2,
        DOWNVOTE_POST: -1,
        NEW_COMMENT: 0,
        UPVOTE_COMMENT: 0,
        DOWNVOTE_COMMENT: 0,
    },
    notificationTypes: {
        QUESTION_NOTIFICATION: 'Question',
        ANSWER_NOTIFICATION: 'Answer',
        COMMENT_NOTIFICATION: 'Comment',
        POST_NOTIFICATION: 'Post',
        USER_NOTIFICATION: 'User',
    },
    badge: {
        basic: 0,
        silver: 500,
        gold: 1500,
    }
};
