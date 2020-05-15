const mongoose = require('mongoose');
const Topic = mongoose.model('topics');
const Answer = mongoose.model('answers');
const Question = mongoose.model('questions');
const Post = mongoose.model('posts');
const User = mongoose.model('users');

const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const START_DATE = '2017-02-04T00:00:00.000Z';
const END_DATE = '3017-02-04T00:00:00.000Z';

module.exports = (app) => {
    app.get('/api/v1/dashboard-topics', queryMiddleware, async(req, res) => {
        const { query } = req.queryParams;
        const {
            startDate = START_DATE,
            endDate = END_DATE,
        } = query;

        try {
            const topics = await Topic.aggregate([
                {
                    $lookup: {
                        from: 'posts',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    postedDate: {
                                        $gte: new Date(startDate),
                                        $lte: new Date(endDate)
                                    },
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
                                    postedDate: {
                                        $gte: new Date(startDate),
                                        $lte: new Date(endDate)
                                    },
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

            const emptyTopicResponse = {
                _id: null,
                topic: '',
                description: '',
                imageUrl: '',
            };

            const emptyTopicQuestions = await Question.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                postedDate: {
                                    $gte: new Date(startDate),
                                    $lte: new Date(endDate)
                                },
                            },
                            { topics: { $size: 0 } }
                        ]
                    }
                }
            ]);

            const emptyTopicPosts = await Post.aggregate([
                {
                    $match: {
                        $and: [
                            {
                                postedDate: {
                                    $gte: new Date(startDate),
                                    $lte: new Date(endDate)
                                },
                            },
                            { topics: { $size: 0 } }
                        ]
                    }
                }
            ]);

            emptyTopicResponse.questions = emptyTopicQuestions.length;
            emptyTopicResponse.posts = emptyTopicPosts.length;

            topics.push(emptyTopicResponse);

            const answers = await Answer.aggregate([
                {
                    $match: {
                        postedDate: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                    }
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
                    $unwind: {
                        path: '$topics',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $group: {
                        _id: '$topics',
                        count: { $sum: 1 }
                    }
                }
            ]);

            answers.forEach((topic) => {
                const dashboardTopic = topics.find(t => {
                    if (t._id === null) {
                        return t._id === topic._id;
                    }
                    return t._id.equals(topic._id);
                });

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

    app.get('/api/v1/dashbaord-summary', queryMiddleware, async(req, res) => {
        const { query } = req.queryParams;
        const {
            startDate = START_DATE,
            endDate = END_DATE,
        } = query;

        try {
            const questions = await Question.aggregate([
                {
                    $match: {
                        postedDate: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                    }
                },
            ]);

            const answers = await Answer.aggregate([
                {
                    $match: {
                        postedDate: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                    }
                },
            ]);

            const posts = await Post.aggregate([
                {
                    $match: {
                        postedDate: {
                            $gte: new Date(startDate),
                            $lte: new Date(endDate)
                        },
                    }
                },
            ]);

            res
                .status(200)
                .json({
                    questions: questions.length,
                    answers: answers.length,
                    posts: posts.length,
                });
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

    app.get('/api/v1/dashboard-tiles', async(req, res) => {
        try {
            const users = await User.aggregate([
                {
                    $group: {
                        _id: '',
                        users: { $sum: 1 },
                        upvotes: { $sum: '$upvotes' },
                        followers: {
                            $sum: { $size: "$interests" }
                        },
                        experts: {
                            $sum: { $size: "$expertIn" }
                        },
                    }
                }
            ]);

            res
                .status(200)
                .json(users);
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