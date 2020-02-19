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

        const newComment = new Comment({
            author: req.user,
            comment,
            target,
            targetID: mongoose.Types.ObjectId(targetID),
        });

        try {
            await newComment.save();
            res
                .status(201)
                .json(newComment);
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

        if (!aggregationMatch.length) {
            aggregationMatch.push({});
        }

        try {
            const comments = await Comment.aggregate([
                { $match: { $and: aggregationMatch } },
                { $sort : { postedDate : -1 } },
                { $skip: pagination.skip || 0 },
                { $limit: pagination.limit || 10 }
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
            const comment = await Comment.findById(commentID);

            if (comment) {
                Object.keys(req.body).forEach((x) => { comment[x] = req.body[x]; });
                comment.lastModified = Date.now();

                await comment.save();
                res
                    .status(200)
                    .json(comment);
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

        try {
            const comment = await Comment.findById(commentID);

            if (comment) {
                voting(comment, req.user, 'upvote');

                await comment.save();
                res
                    .status(200)
                    .json(comment);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: COMMENT_NOT_FOUND
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

        try {
            const comment = await Comment.findById(commentID);

            if (comment) {
                voting(comment, req.user);

                await comment.save();
                res
                    .status(200)
                    .json(comment);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: COMMENT_NOT_FOUND
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
