const mongoose = require('mongoose');
const Question = mongoose.model('questions');
const Answer = mongoose.model('answers');
const User = mongoose.model('users');
const Topic = mongoose.model('topics');

const { errors: { QUESTION_NOT_FOUND } } = require('../utils/constants');
const emailNotify = require('../services/email/emailService');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');

module.exports = (app) => {
    app.post('/api/v1/question.add', loginMiddleware, async(req, res) => {
        const {
            suggestedExperts = [],
            topics = [],
            question,
            description,
        } = req.body;

        const { _id } = req.user;

        try {
            const chosenTopics = await Topic.find({ _id: { $in: topics.map((topic) => mongoose.Types.ObjectId(topic)) } });

            const newQuestion = new Question({
                author: _id,
                suggestedExperts,
                topics,
                question,
                description,
            });

            await newQuestion.save();

            const responseObject = {
                ...newQuestion._doc,
                author: req.user,
                topics: chosenTopics || [],
            };
            emailNotify('newQuestion', responseObject, {
                author: req.user,
                suggestedExperts,
                topics,
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

    app.get('/api/v1/questions', loginMiddleware, queryMiddleware, async(req, res) => {
        const {
            custom,
            query,
            pagination,
        } = req.queryParams;
        const {
            interests,
            _id,
        } = req.user;

        const aggregationMatch = Object.keys(query).map((key) => { return { [key]: query[key] }; });

        if (custom._onlyInterests) {
            aggregationMatch.push({
                $or: [
                    { 'topics': { $in: interests.map((interest) => mongoose.Types.ObjectId(interest)) } },
                    { 'followers': mongoose.Types.ObjectId(_id) },
                ],
            });
        }

        if (custom._onlySuggested) {
            aggregationMatch.push({ 'suggestedExperts': mongoose.Types.ObjectId(_id) });
        }

        if (custom._ownQuestions) {
            aggregationMatch.push({ 'author': mongoose.Types.ObjectId(_id) });
        }

        if (!aggregationMatch.length) {
            res
                .status(200)
                .json([]);
            return;
        }

        try {
            const questions = await Question.aggregate([
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
                {
                    $lookup: {
                        from: 'users',
                        localField: 'suggestedExperts',
                        foreignField: '_id',
                        as: 'suggestedExperts',
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
                            { $addFields: { upvotersCount: { $size: '$upvoters' } } },
                            {
                                $sort: {
                                    upvotersCount: -1,
                                    postedDate: -1,
                                },
                            },
                            { $limit: 1 },
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
                                    ],
                                    as: 'comments',
                                },
                            },
                            {
                                $project: {
                                    comments: {
                                        $cond: {
                                            if: { $isArray: '$comments' },
                                            then: { $size: '$comments' },
                                            else: 0,
                                        },
                                    },
                                    answer: 1,
                                    author: 1,
                                    downvoters: 1,
                                    postedDate: 1,
                                    questionID: 1,
                                    upvoters: 1,
                                    upvotersCount: 1,
                                },
                            },
                        ],
                        as: 'answers',
                    },
                },
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.get('/api/v1/trending-questions', loginMiddleware, async(req, res) => {
        try {
            const questions = await Answer.aggregate([
                {
                    $group: {
                        _id: '$questionID',
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from: 'questions',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'question',
                    },
                },
                {
                    $unwind: {
                        path: '$question',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        question: '$question.question',
                    },
                },
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.get('/api/v1/related-questions', loginMiddleware, queryMiddleware, async(req, res) => {
        const {
            query,
        } = req.queryParams;

        const { questionID } = query;

        try {
            const question = await Question.findById(questionID);

            if (question) {
                let results = await Question.aggregate([
                    {
                        $match: {
                            $and: [
                                { _id: { $ne: mongoose.Types.ObjectId(questionID) } },
                                { $text: { $search: question.question } },
                            ],
                        },
                    },
                    { $limit: 10 },
                    { $addFields: { score: { $meta: 'textScore' } } },
                    { $sort: { score: { $meta: 'textScore' } } },
                    {
                        $project: {
                            question: 1,
                        },
                    },
                ]);

                if (results.length < 10) {
                    const topicsMatch = await Question.aggregate([
                        {
                            $match: {
                                $and: [
                                    { _id: { $ne: mongoose.Types.ObjectId(questionID) } },
                                    { topics: { $in: question.topics.map((topic) => mongoose.Types.ObjectId(topic)) } },
                                ],
                            },
                        },
                        { $limit: 10 - results.length },
                        {
                            $project: {
                                question: 1,
                            },
                        },
                    ]);

                    results = [
                        ...results,
                        ...topicsMatch,
                    ];
                }
                res
                    .status(200)
                    .json(results);
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
                    response: String(e),
                    stack: e.stack,
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
            const question = await Question.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(questionID) } },
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
                        from: 'users',
                        localField: 'suggestedExperts',
                        foreignField: '_id',
                        as: 'suggestedExperts',
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
            ]);

            if (question) {
                const answers = await Answer.aggregate([
                    { $match: { questionID: mongoose.Types.ObjectId(questionID) } },
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
                        ...question[0],
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.put('/api/v1/question/:questionID', loginMiddleware, async(req, res) => {
        try {
            const { questionID } = req.params;
            const {
                description,
                suggestedExperts,
                topics,
                question: questionString,
            } = req.body;

            const question = await Question.findById(questionID);
            const responseObject = { _id: questionID };

            if (question) {
                if (suggestedExperts) {
                    question.suggestedExperts = [
                        ...question.suggestedExperts,
                        ...suggestedExperts,
                    ];
                    const experts = await User.find({ _id: { $in: question.suggestedExperts.map((expert) => mongoose.Types.ObjectId(expert)) } });
                    responseObject.suggestedExperts = experts;
                }

                if (topics) {
                    const chosenTopics = await Topic.find({ _id: { $in: topics.map((topic) => mongoose.Types.ObjectId(topic)) } });
                    question.topics = topics;
                    responseObject.topics = chosenTopics;
                }

                if (questionString) {
                    question.question = questionString;
                    responseObject.question = questionString;
                }

                if (description) {
                    question.description = description;
                    responseObject.description = description;
                }

                question.lastModified = Date.now();

                await question.save();
                res
                    .status(200)
                    .json({
                        ...responseObject,
                        lastModified: question.lastModified,
                    });
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
                    response: String(e),
                    stack: e.stack,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.post('/api/v1/question.follow', loginMiddleware, async(req, res) => {
        const {
            questionID,
        } = req.body;

        const {
            _id,
        } = req.user;

        try {
            const question = await Question.findById(questionID);

            if (question) {
                const isFollowing = question.followers.find((follower) => follower.equals(_id));

                if (isFollowing) {
                    question.followers = question.followers.filter((follower) => !follower.equals(_id));
                }
                else {
                    question.followers = [
                        ...question.followers,
                        _id,
                    ];
                }

                await question.save();

                const responseObject = {
                    _id: questionID,
                    follower: req.user,
                    unfollow: Boolean(isFollowing),
                };
                emailNotify('followQuestion', responseObject);

                res
                    .status(200)
                    .json({
                        ...responseObject,
                        follower: _id,
                    });
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });
};
