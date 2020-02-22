const mongoose = require('mongoose');
const Question = mongoose.model('questions');
const Answer = mongoose.model('answers');
const User = mongoose.model('users');
const Topic = mongoose.model('topics');

const { errors: { QUESTION_NOT_FOUND } } = require('../utils/constants');
// const emailNotify = require('../services/emailService');
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
            // emailNotify('newQuestion', newQuestion, {
            //     author: req.user,
            //     suggestedExperts: experts,
            //     topics: chosenTopics,
            // });

            res
                .status(201)
                .json({
                    ...newQuestion._doc,
                    author: req.user,
                    topics: chosenTopics,
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
                        localField: 'followers',
                        foreignField: '_id',
                        as: 'followers',
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
                            { $unwind: '$author' },
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
                { $unwind: '$author' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'followers',
                        foreignField: '_id',
                        as: 'followers',
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
                    response: e,
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
                    const experts = await User.find({ _id: { $in: suggestedExperts.map((expert) => mongoose.Types.ObjectId(expert)) } });
                    question.suggestedExperts = suggestedExperts;
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
                res
                    .status(200)
                    .json({
                        _id: questionID,
                        follower: req.user,
                        unfollow: Boolean(isFollowing),
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
                    response: e,
                });
        }
    });
};
