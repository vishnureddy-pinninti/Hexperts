/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const Question = mongoose.model('questions');
const Answer = mongoose.model('answers');

const { errors: { QUESTION_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');

module.exports = (app) => {
    app.post('/api/v1/question.add', loginMiddleware, async(req, res) => {
        const {
            suggestedExperts,
            tags,
            question,
            description,
        } = req.body;

        const newQuestion = new Question({
            author: req.user,
            suggestedExperts,
            tags,
            question,
            description,
        });

        try {
            await newQuestion.save();
            res
                .status(201)
                .json(newQuestion);
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

    app.get('/api/v1/questions', loginMiddleware, queryMiddleware, async(req, res) => {
        const {
            custom,
            query,
            pagination,
        } = req.queryParams;
        const {
            interests,
            userid,
        } = req.user;
        const aggregationMatch = Object.keys(query).map((key) => { return { [key]: query[key] }; });

        if (custom._onlyInterests) {
            aggregationMatch.push({
                $or: [
                    { tags: { $in: interests } },
                    { 'followers.userid': userid },
                ],
            });
        }

        if (custom._onlySuggested) {
            aggregationMatch.push({ 'suggestedExperts.userid': userid });
        }

        if (!aggregationMatch.length) {
            aggregationMatch.push({});
        }

        try {
            const questions = await Question.aggregate([
                { $match: { $and: aggregationMatch } },
                { $sort: { postedDate: -1 } },
                {
                    $lookup: {
                        from: 'answers',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$questionID',
                                        ],
                                    },
                                },
                            },
                            { $addFields: { upvotersCount: { $size: '$upvoters' } } },
                            {
                                $sort: {
                                    upvotersCount: -1,
                                    postedDate: -1,
                                },
                            },
                            { $limit: 1 },
                        ],
                        as: 'answers',
                    },
                },
                { $skip: pagination.skip || 0 },
                { $limit: pagination.limit || 10 },
            ]);

            res
                .status(200)
                .json(questions);
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

    app.get('/api/v1/question/:questionID', loginMiddleware, queryMiddleware, async(req, res) => {
        try {
            const { questionID } = req.params;
            const {
                pagination,
                custom,
            } = req.queryParams;
            const question = await Question.findById(questionID);

            if (question) {
                const answers = await Answer.aggregate([
                    { $match: { questionID: mongoose.Types.ObjectId(questionID) } },
                    { $addFields: { upvotersCount: { $size: '$upvoters' } } },
                    {
                        $sort: {
                            upvotersCount: -1,
                            postedDate: -1,
                        },
                    },
                    {
                        $lookup: {
                            from: 'comments',
                            let: { id: '$_id' },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: [
                                                '$$id',
                                                '$targetID',
                                            ],
                                        },
                                    },
                                },
                                { $addFields: { upvotersCount: { $size: '$upvoters' } } },
                                {
                                    $sort: {
                                        upvotersCount: -1,
                                        postedDate: -1,
                                    },
                                },
                                { $count: 'commentsCount' },
                            ],
                            as: 'comments',
                        },
                    },
                    {
                        $facet: {
                            results: [
                                {
                                    $skip: pagination.skip || 0,
                                },
                                {
                                    $limit: pagination.limit || 10,
                                },
                            ],
                            totalCount: [
                                {
                                    $count: 'count',
                                },
                            ],
                        },
                    },
                    { $unwind: '$totalCount' },
                    {
                        $project: {
                            results: 1,
                            totalCount: '$totalCount.count',
                        },
                    },
                ]);

                let response = { answers: answers[0] };

                if (!custom._onlyanswers) {
                    response = {
                        ...question._doc,
                        ...response,
                    };
                }

                res
                    .status(200)
                    .json(response);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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

    app.put('/api/v1/question/:questionID', loginMiddleware, async(req, res) => {
        try {
            const { questionID } = req.params;
            const question = await Question.findById(questionID);

            if (question) {
                Object.keys(req.body).forEach((x) => { question[x] = req.body[x]; });
                question.lastModified = Date.now();

                await question.save();
                res
                    .status(200)
                    .json(question);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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

    app.delete('/api/v1/question/:questionID', loginMiddleware, async(req, res) => {
        try {
            const { questionID } = req.params;
            const question = await Question.findById(questionID);

            if (question) {
                await question.remove();
                res
                    .status(200)
                    .json({ questionID });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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

    app.post('/api/v1/question.follow', loginMiddleware, async(req, res) => {
        const {
            questionID,
        } = req.body;

        const {
            userid,
        } = req.user;

        try {
            const question = await Question.findById(questionID);

            if (question) {
                const isFollowing = question.followers.find((follower) => follower.userid === userid);

                if (isFollowing) {
                    question.followers = question.followers.filter((follower) => follower.userid !== userid);
                }
                else {
                    question.followers = [
                        ...question.followers,
                        req.user,
                    ];
                }

                await question.save();
                res
                    .status(200)
                    .json(question);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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
