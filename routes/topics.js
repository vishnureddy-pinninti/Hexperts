const mongoose = require('mongoose');
const Topic = mongoose.model('topics');
const Question = mongoose.model('questions');
const User = mongoose.model('users');

const { errors: { QUESTION_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');

module.exports = (app) => {
    app.post('/api/v1/topics.add', loginMiddleware, async(req, res) => {
        const {
            topics = [],
        } = req.body;

        try {
            const existingTopics = await Topic.distinct('topic');
            let newTopics;

            if (existingTopics.length) {
                const regex = new RegExp( existingTopics.join( '|' ), 'i');
                newTopics = topics.filter((topic) => !regex.test( topic ) ).map((topic) => { return { topic }; });
            }
            else {
                newTopics = topics.map((topic) => { return { topic }; });
            }

            const response = await Topic.insertMany(newTopics);
            res
                .status(200)
                .json(response);
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

    app.get('/api/v1/topics', loginMiddleware, async(req, res) => {
        try {
            const topics = await Topic.find({});
            res
                .status(200)
                .json(topics);
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

    app.get('/api/v1/topic/:topicID', loginMiddleware, queryMiddleware, async(req, res) => {
        const { topicID } = req.params;
        const {
            pagination,
        } = req.queryParams;

        try {
            const topic = await Topic.findById(topicID);

            if (topic) {
                const questions = await Question.aggregate([
                    { $match: { 'topics': mongoose.Types.ObjectId(topicID) } },
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

                const followers = await User.aggregate([
                    { $match: { 'interests': mongoose.Types.ObjectId(topicID) } },
                    { $count: 'following' },
                ]);

                const response = {
                    ...topic._doc,
                    questions,
                    followers: followers[0] && followers[0].following || 0,
                };

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

    app.get('/api/v1/suggested-experts', loginMiddleware, queryMiddleware, async(req, res) => {
        const {
            custom,
        } = req.queryParams;

        const query = {};

        if (custom._topics) {
            const fields = custom._topics.split(',');
            query.interests = { $in: fields.map((field) => mongoose.Types.ObjectId(field)) };
        }

        try {
            const experts = await User.find(query);
            res
                .status(200)
                .json(experts);
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
