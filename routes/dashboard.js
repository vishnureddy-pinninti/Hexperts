const mongoose = require('mongoose');
const Topic = mongoose.model('topics');
const Answer = mongoose.model('answers');

const loginMiddleware = require('../middlewares/loginMiddleware');

module.exports = (app) => {
    app.get('/api/v1/dashboard-topics', loginMiddleware, async(req, res) => {
        try {
            const topics = await Topic.aggregate([
                {
                    $lookup: {
                        from: 'posts',
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
                        ],
                        as: 'posts',
                    }
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
                        ],
                        as: 'questions',
                    },
                },
                {
                    $project: {
                        posts: {
                            $cond: {
                                if: { $isArray: '$posts' },
                                then: { $size: '$posts' },
                                else: 0,
                            },
                        },
                        questions: {
                            $cond: {
                                if: { $isArray: '$questions' },
                                then: { $size: '$questions' },
                                else: 0,
                            },
                        },
                        topic: 1,
                        description: 1,
                        imageUrl: 1,
                    },
                },
            ]);

            const answers = await Answer.aggregate([
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
                                $project: {
                                    topics: 1,
                                }
                            }
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
                {
                    $project: {
                        topics: '$question.topics',
                    }
                },
                {
                    $unwind: "$topics",
                },
                {
                    $group: {
                        _id: '$topics',
                        count: { $sum: 1 }
                    }
                }
            ]);

            answers.forEach((topic) => {
                const dashboardTopic = topics.find(t => t._id.equals(topic._id));

                if (dashboardTopic) {
                    dashboardTopic.answers = topic.count;
                }
            });

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
};