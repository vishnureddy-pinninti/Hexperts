const mongoose = require('mongoose');
const Comment = mongoose.model('comments');

const { errors: { COMMENT_NOT_FOUND } } = require('../utils/constants');
const voting = require('../utils/voting');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');

module.exports = (app) => {
    app.post('/api/v1/comment.add', loginMiddleware, async(req, res) => {
        const {
            comment,
            target,
            targetID,
        } = req.body;

        const { _id } = req.user;

        const newComment = new Comment({
            author: mongoose.Types.ObjectId(_id),
            comment,
            target,
            targetID: mongoose.Types.ObjectId(targetID),
        });

        try {
            await newComment.save();
            res
                .status(201)
                .json({
                    ...newComment._doc,
                    author: req.user,
                });
        }
        catch (e) {
            res
                .status(500)
                .json({
                    error: true,
                    response: e,
                });
        }
    });

    app.get('/api/v1/comments/:answerID', loginMiddleware, queryMiddleware, async(req, res) => {
        const {
            pagination,
        } = req.queryParams;
        const { answerID } = req.params;
        const aggregationMatch = [ { targetID: mongoose.Types.ObjectId(answerID) } ];

        try {
            const comments = await Comment.aggregate([
                { $match: { $and: aggregationMatch } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author',
                    },
                },
                { $unwind: '$author' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'downvoters',
                        foreignField: '_id',
                        as: 'downvoters',
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'upvoters',
                        foreignField: '_id',
                        as: 'upvoters',
                    },
                },
                { $sort: { postedDate: -1 } },
                { $skip: pagination.skip || 0 },
                { $limit: pagination.limit || 10 },
            ]);

            res
                .status(200)
                .json(comments);
        }
        catch (e) {
            res
                .status(500)
                .json({
                    error: true,
                    response: e,
                });
        }
    });

    app.put('/api/v1/comments/:commentID', loginMiddleware, async(req, res) => {
        try {
            const { commentID } = req.params;
            const { comment: commentString } = req.body;
            const comment = await Comment.findById(commentID);

            if (comment) {
                if (commentString) {
                    comment.comment = commentString;
                    comment.lastModified = Date.now();
                }

                await comment.save();
                res
                    .status(200)
                    .json({
                        _id: commentID,
                        comment: commentString,
                        lastModified: comment.lastModified,
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: COMMENT_NOT_FOUND,
                    });
            }
        }
        catch (e) {
            res
                .status(500)
                .json({
                    error: true,
                    response: e,
                });
        }
    });

    app.delete('/api/v1/comments/:commentID', loginMiddleware, async(req, res) => {
        try {
            const { commentID } = req.params;
            const comment = await Comment.findById(commentID);

            if (comment) {
                await comment.remove();
                res
                    .status(200)
                    .json({ commentID });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: COMMENT_NOT_FOUND,
                    });
            }
        }
        catch (e) {
            res
                .status(500)
                .json({
                    error: true,
                    response: e,
                });
        }
    });

    app.get('/api/v1/comment-upvote/:commentID', loginMiddleware, async(req, res) => {
        const {
            commentID,
        } = req.params;

        const { _id } = req.user;

        try {
            const comment = await Comment.findById(commentID);

            if (comment) {
                const alreadyVoted = voting(comment, _id, 'upvote');

                await comment.save();
                res
                    .status(200)
                    .json({
                        _id: commentID,
                        upvoter: req.user,
                        removeVoting: alreadyVoted,
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: COMMENT_NOT_FOUND,
                    });
            }
        }
        catch (e) {
            res
                .status(500)
                .json({
                    error: true,
                    response: e,
                });
        }
    });

    app.get('/api/v1/comment-downvote/:commentID', loginMiddleware, async(req, res) => {
        const {
            commentID,
        } = req.params;

        const { _id } = req.user;

        try {
            const comment = await Comment.findById(commentID);

            if (comment) {
                const alreadyVoted = voting(comment, _id);

                await comment.save();
                res
                    .status(200)
                    .json({
                        _id: commentID,
                        downvoter: req.user,
                        removeVoting: alreadyVoted,
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: COMMENT_NOT_FOUND,
                    });
            }
        }
        catch (e) {
            res
                .status(500)
                .json({
                    error: true,
                    response: e,
                });
        }
    });
};