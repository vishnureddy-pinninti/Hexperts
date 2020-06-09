const mongoose = require('mongoose');
const Comment = mongoose.model('comments');

const { errors: { COMMENT_NOT_FOUND } } = require('../utils/constants');
const voting = require('../utils/voting');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const emailNotify = require('../services/email/emailService');
const htmlToText = require('../utils/htmlToText');
const { inBButNotInA } = require('../utils/common');

module.exports = (app) => {
    app.post('/api/v1/comment.add', loginMiddleware, async(req, res) => {
        const {
            comment,
            target,
            targetID,
        } = req.body;

        const { _id } = req.user;
        const { xorigin } = req.headers;

        const newComment = new Comment({
            author: mongoose.Types.ObjectId(_id),
            comment,
            target,
            targetID: mongoose.Types.ObjectId(targetID),
        });

        try {
            const { userMentions, plainText } = htmlToText(comment);
            await newComment.save();

            const responseObject = {
                ...newComment._doc,
                author: req.user,
            };
            emailNotify('newComment', {
                ...responseObject,
                req: req.io,
                origin: xorigin,
                comment: plainText,
                userMentions,
            });

            res
                .status(201)
                .json(responseObject);
        }
        catch (e) {
            res
                .status(500)
                .json({
                    error: true,
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    // This is to get single comment details for notification purpose
    app.get('/api/v1/comment/:commentID', loginMiddleware, async(req, res) => {
        const { commentID } = req.params;

        const comment = await Comment.findById(commentID);

        if (comment) {
            const { target } = comment;

            try {
                if (target === 'answers') {
                    const comments = await Comment.aggregate([
                        { $match: { _id: mongoose.Types.ObjectId(commentID) } },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'author',
                                foreignField: '_id',
                                as: 'author',
                            },
                        },
                        {
                            $unwind: {
                                path: '$author',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: 'answers',
                                let: { id: '$targetID' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: [
                                                    '$$id',
                                                    '$_id',
                                                ],
                                            },
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'users',
                                            localField: 'author',
                                            foreignField: '_id',
                                            as: 'author',
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: '$author',
                                            preserveNullAndEmptyArrays: true,
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'topics',
                                            localField: 'topics',
                                            foreignField: '_id',
                                            as: 'topics',
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'questions',
                                            let: { id: '$questionID' },
                                            pipeline: [
                                                {
                                                    $match: {
                                                        $expr: {
                                                            $eq: [
                                                                '$$id',
                                                                '$_id',
                                                            ],
                                                        },
                                                    },
                                                },
                                                {
                                                    $lookup: {
                                                        from: 'users',
                                                        localField: 'author',
                                                        foreignField: '_id',
                                                        as: 'author',
                                                    },
                                                },
                                                {
                                                    $unwind: {
                                                        path: '$author',
                                                        preserveNullAndEmptyArrays: true,
                                                    },
                                                },
                                                {
                                                    $lookup: {
                                                        from: 'topics',
                                                        localField: 'topics',
                                                        foreignField: '_id',
                                                        as: 'topics',
                                                    },
                                                },
                                            ],
                                            as: 'question',
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: '$question',
                                            preserveNullAndEmptyArrays: true,
                                        },
                                    },
                                ],
                                as: 'answer',
                            },
                        },
                        {
                            $unwind: {
                                path: '$answer',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $project: {
                                question: '$answer.question',
                                answer: '$answer',
                                comment: 1,
                                author: 1,
                                downvoters: 1,
                                lastModified: 1,
                                postedDate: 1,
                                target: 1,
                                targetID: 1,
                                upvoters: 1,
                            },
                        },
                    ]);

                    res
                        .status(200)
                        .json(comments[0]);
                }
                else {
                    const comments = await Comment.aggregate([
                        { $match: { _id: mongoose.Types.ObjectId(commentID) } },
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'author',
                                foreignField: '_id',
                                as: 'author',
                            },
                        },
                        {
                            $unwind: {
                                path: '$author',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                        {
                            $lookup: {
                                from: 'posts',
                                let: { id: '$targetID' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: {
                                                $eq: [
                                                    '$$id',
                                                    '$_id',
                                                ],
                                            },
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'users',
                                            localField: 'author',
                                            foreignField: '_id',
                                            as: 'author',
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: '$author',
                                            preserveNullAndEmptyArrays: true,
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: 'blogs',
                                            localField: 'blog',
                                            foreignField: '_id',
                                            as: 'blog',
                                        },
                                    },
                                    {
                                        $unwind: {
                                            path: '$blog',
                                            preserveNullAndEmptyArrays: true,
                                        },
                                    },
                                ],
                                as: 'post',
                            },
                        },
                        {
                            $unwind: {
                                path: '$post',
                                preserveNullAndEmptyArrays: true,
                            },
                        },
                    ]);

                    res
                        .status(200)
                        .json(comments[0]);
                }
            }
            catch (e) {
                res
                    .status(500)
                    .json({
                        error: true,
                        response: String(e),
                        stack: e.stack,
                    });
            }
        }
        else {
            res
                .status(404)
                .json({
                    error: true,
                    response: COMMENT_NOT_FOUND,
                });
        }
    });

    app.get('/api/v1/comments/:targetID', loginMiddleware, queryMiddleware, async(req, res) => {
        const {
            pagination,
        } = req.queryParams;
        const { targetID } = req.params;
        const aggregationMatch = [ { targetID: mongoose.Types.ObjectId(targetID) } ];

        try {
            const comments = await Comment.aggregate([
                { $match: { $and: aggregationMatch } },
                { $sort: { postedDate: -1 } },
                { $skip: pagination.skip || 0 },
                { $limit: pagination.limit || 10 },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author',
                    },
                },
                {
                    $unwind: {
                        path: '$author',
                        preserveNullAndEmptyArrays: true,
                    },
                },
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.put('/api/v1/comments/:commentID', loginMiddleware, async(req, res) => {
        try {
            const { commentID } = req.params;
            const { comment: commentString } = req.body;
            const comment = await Comment.findById(commentID);

            if (comment) {
                let newMentions = [];
                if (commentString) {
                    const { userMentions } = htmlToText(commentString);
                    const { userMentions: oldUserMentions } = htmlToText(comment.comment);
                    newMentions = inBButNotInA(oldUserMentions, userMentions);
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
                        userMentions: newMentions,
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
                    response: String(e),
                    stack: e.stack,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.get('/api/v1/comment-upvote/:commentID', loginMiddleware, async(req, res) => {
        const {
            commentID,
        } = req.params;

        const { _id } = req.user;
        const { xorigin } = req.headers;

        try {
            const comment = await Comment.findById(commentID);

            if (comment) {
                const { alreadyVoted, secondaryVoted } = voting(comment, _id, 'upvote');

                await comment.save();

                const responseObject = {
                    _id: commentID,
                    upvoter: req.user,
                    removeVoting: alreadyVoted,
                };
                emailNotify('upvoteComment', {
                    ...responseObject,
                    req: req.io,
                    origin: xorigin,
                    secondaryVoted,
                });

                res
                    .status(200)
                    .json({
                        ...responseObject,
                        upvoter: _id,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.get('/api/v1/comment-downvote/:commentID', loginMiddleware, async(req, res) => {
        const {
            commentID,
        } = req.params;

        const { _id } = req.user;
        const { xorigin } = req.headers;

        try {
            const comment = await Comment.findById(commentID);

            if (comment) {
                const { alreadyVoted, secondaryVoted } = voting(comment, _id);

                await comment.save();

                const responseObject = {
                    _id: commentID,
                    downvoter: req.user,
                    removeVoting: alreadyVoted,
                };
                emailNotify('downvoteComment', {
                    ...responseObject,
                    req: req.io,
                    origin: xorigin,
                    secondaryVoted,
                });

                res
                    .status(200)
                    .json({
                        ...responseObject,
                        downvoter: _id,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });
};
