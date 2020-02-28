const mongoose = require('mongoose');
const Topic = mongoose.model('topics');
const User = mongoose.model('users');

const { errors: { TOPIC_NOT_FOUND } } = require('../utils/constants');
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
            const topic = await Topic.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(topicID) } },
                {
                    $lookup: {
                        from: 'users',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: [
                                            '$$id',
                                            '$interests',
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'following',
                    },
                },
                {
                    $lookup: {
                        from: 'questions',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: [
                                            '$$id',
                                            '$topics',
                                        ],
                                    },
                                },
                            },
                            { $sort: { postedDate: -1 } },
                            { $skip: pagination.skip || 0 },
                            { $limit: pagination.limit || 10 },
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
                                    ],
                                    as: 'answers',
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
                        as: 'questions',
                    },
                },
                {
                    $project: {
                        topic: 1,
                        lastModified: 1,
                        createdDate: 1,
                        imageUrl: 1,
                        description: 1,
                        following: {
                            $cond: {
                                if: { $isArray: '$following' },
                                then: { $size: '$following' },
                                else: 0,
                            },
                        },
                        questions: 1,
                    },
                },
            ]);

            res
                .status(200)
                .json(topic[0]);
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

    app.put('/api/v1/topic/:topicID', loginMiddleware, async(req, res) => {
        try {
            const { topicID } = req.params;
            const {
                topic: topicString,
                imageUrl,
                description,
            } = req.body;

            const topic = await Topic.findById(topicID);
            const responseObject = { _id: topicID };

            if (topic) {
                if (topicString) {
                    topic.topic = topicString;
                    responseObject.topic = topicString;
                }

                if (imageUrl) {
                    topic.imageUrl = imageUrl;
                    responseObject.imageUrl = imageUrl;
                }

                if (description) {
                    topic.description = description;
                    responseObject.description = description;
                }

                topic.lastModified = Date.now();

                await topic.save();
                res
                    .status(200)
                    .json({
                        ...responseObject,
                        lastModified: topic.lastModified,
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: TOPIC_NOT_FOUND,
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
            query.expertIn = { $in: fields.map((field) => mongoose.Types.ObjectId(field)) };
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
