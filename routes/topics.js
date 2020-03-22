const mongoose = require('mongoose');
const Topic = mongoose.model('topics');
const User = mongoose.model('users');

const { errors: { TOPIC_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const upload = require('../utils/uploads');

module.exports = (app) => {
    app.post('/api/v1/topics.add', loginMiddleware, async(req, res) => {
        const {
            topics = [],
        } = req.body;

        try {
            const existingTopics = await Topic.distinct('topic');
            const ciTopics = existingTopics.map((topic) => topic.toLowerCase());
            let newTopics;

            if (existingTopics.length) {
                newTopics = topics.filter((topic) => !ciTopics.includes( topic.toLowerCase() ) ).map((topic) => { return { topic }; });
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
                    response: String(e),
                    stack: e.stack,
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
                    response: String(e),
                    stack: e.stack,
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
                            {
                                $project: {
                                    _id: 1,
                                },
                            },
                        ],
                        as: 'followers',
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
                                                commentsCount: {
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
                                        {
                                            $facet: {
                                                results: [
                                                    {
                                                        $limit: 1,
                                                    },
                                                ],
                                                totalCount: [
                                                    {
                                                        $count: 'count',
                                                    },
                                                ],
                                            },
                                        },
                                        {
                                            $unwind: {
                                                path: '$totalCount',
                                                preserveNullAndEmptyArrays: true,
                                            },
                                        },
                                        {
                                            $project: {
                                                results: 1,
                                                totalCount: {
                                                    $cond: {
                                                        if: {
                                                            $eq: [
                                                                { $type: '$totalCount' },
                                                                'object',
                                                            ],
                                                        },
                                                        then: '$totalCount.count',
                                                        else: 0,
                                                    },
                                                },
                                            },
                                        },
                                    ],
                                    as: 'answers',
                                },
                            },
                            {
                                $unwind: {
                                    path: '$answers',
                                    preserveNullAndEmptyArrays: true,
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
                        followers: {
                            $cond: {
                                if: { $isArray: '$followers' },
                                then: {
                                    $map: {
                                        input: '$followers',
                                        as: 'follower',
                                        in: '$$follower._id',
                                    },
                                },
                                else: [],
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.put('/api/v1/topic/:topicID', loginMiddleware, upload.any(), async(req, res) => {
        try {
            const { topicID } = req.params;
            const {
                topic: topicString,
                description,
            } = req.body;

            const topic = await Topic.findById(topicID);
            const responseObject = { _id: topicID };

            if (topic) {
                if (topicString) {
                    topic.topic = topicString;
                    responseObject.topic = topicString;
                }

                if (req.files.length) {
                    topic.imageUrl = `/api/v1/images/${req.files[0].filename}`;
                    responseObject.imageUrl = `/api/v1/images/${req.files[0].filename}`;
                }

                if (description) {
                    topic.description = description;
                    topic.plainText = description;
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
                    response: String(e),
                    stack: e.stack,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });
};
