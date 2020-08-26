const mongoose = require('mongoose');
const Topic = mongoose.model('topics');
const Answer = mongoose.model('answers');
const Question = mongoose.model('questions');
const Post = mongoose.model('posts');
const User = mongoose.model('users');

const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const getMonthlyTopContributors = require('../utils/getMonthlyTopContributors')
const START_DATE = '2017-02-04T00:00:00.000Z';
const END_DATE = '3017-02-04T00:00:00.000Z';

const MONTH = new Date().getMonth();
const FULLYEAR = new Date().getFullYear();

module.exports = (app) => {
    app.get('/api/v1/dashboard-topics', loginMiddleware, adminMiddleware, queryMiddleware, async(req, res) => {
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
                    $lookup: {
                        from: 'answers',
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
                        as: 'answers',
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
                        answers: {
                            $cond: {
                                if: { $isArray: '$answers' },
                                then: { $size: '$answers' },
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

            const emptyTopicAnswers = await Answer.aggregate([
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
            emptyTopicResponse.answers = emptyTopicAnswers.length;

            topics.push(emptyTopicResponse);

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

    app.get('/api/v1/dashbaord-summary', loginMiddleware, adminMiddleware, queryMiddleware, async(req, res) => {
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

            const topics = await Topic.aggregate([
                {
                    $match: {
                        createdDate: {
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
                    topics: topics.length,
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

    app.get('/api/v1/user-summary', loginMiddleware, adminMiddleware, async(req, res) => {
        try {
            const users = await User.aggregate([
                {
                    $group: {
                        _id: '',
                        users: { $sum: 1 },
                        upvotes: { $sum: '$upvotes' },
                    }
                }
            ]);

            const followers = await User.find({ interests: { $exists: true, $ne: [] } });
            const experts = await User.find({ expertIn: { $exists: true, $ne: [] } });

            users[0].followers = followers.length;
            users[0].experts = experts.length;

            res
                .status(200)
                .json(users[0]);
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

    app.get('/api/v1/dashboard-users', loginMiddleware, adminMiddleware, queryMiddleware, async(req, res) => {
        const { query } = req.queryParams;
        const {
            startDate = START_DATE,
            endDate = END_DATE,
        } = query;

        try {
            const users = await User.aggregate([
                {
                    $lookup: {
                        from: 'answers',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    postedDate: {
                                        $gte: new Date(startDate),
                                        $lte: new Date(endDate)
                                    },
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$author',
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'answers',
                    },
                },
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
                                        $eq: [
                                            '$$id',
                                            '$author',
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'posts',
                    },
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
                                        $eq: [
                                            '$$id',
                                            '$author',
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
                        name: 1,
                        email: 1,
                        jobTitle: 1,
                        role: 1,
                        answers: {
                            $cond: {
                                if: { $isArray: '$answers' },
                                then: { $size: '$answers' },
                                else: 0,
                            },
                        },
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
                        upvotes: 1,
                        reputation: 1,
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

    app.get('/api/v1/dashboard-monthlyTopContributors', loginMiddleware, adminMiddleware, queryMiddleware, async(req, res) => {
        const { query } = req.queryParams;
        const {
            month = MONTH+1,
            year = FULLYEAR,
        } = query;
        try {
            const users = await User.aggregate([
                {
                    $lookup: {
                        from: "questions",
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $project:{
                                    author: 1,
                                    postedMonth: { $month: "$postedDate" },
                                    postedYear: { $year: "$postedDate" },
                                }
                            },
                            {
                                $match: {
                                    postedMonth: {
                                        $eq: parseInt(month)
                                    },
                                    postedYear: {
                                        $eq: parseInt(year)
                                    },
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$author',
                                        ],
                                    },
                                },
                            },
                        ], 
                        as: "questions"
                    }
                },
                {
                    $lookup: {
                        from: "answers",
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $project:{
                                    author: 1,
                                    postedMonth: { $month: "$postedDate" },
                                    postedYear: { $year: "$postedDate" },
                                }
                            },
                            {
                                $match: {
                                    postedMonth: {
                                        $eq: parseInt(month)
                                    },
                                    postedYear: {
                                        $eq: parseInt(year)
                                    },
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$author',
                                        ],
                                    },
                                },
                            },
                        ], 
                        as: "answers"
                    }
                },
                {
                    $lookup: {
                        from: "posts",
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $project:{
                                    author: 1,
                                    postedMonth: { $month: "$postedDate" },
                                    postedYear: { $year: "$postedDate" },
                                }
                            },
                            {
                                $match: {
                                    postedMonth: {
                                        $eq: parseInt(month)
                                    },
                                    postedYear: {
                                        $eq: parseInt(year)
                                    },
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$author',
                                        ],
                                    },
                                },
                            },
                        ], 
                        as: "posts"
                    }
                },
                {
                    $lookup: {
                        from: "answers",
                        let: { id: '$_id' },
                        pipeline: [
                            {$unwind : "$upvoters" },
                            {
                                $project:{
                                    author: 1,
                                    UpvoteMonth: { $month: "$upvoters.createdDate" },
                                    UpvoteYear: { $year: "$upvoters.createdDate" },
                                }
                            },
                            {
                                $match: {
                                    UpvoteMonth: {
                                        $eq: parseInt(month)
                                    },
                                    UpvoteYear: {
                                        $eq: parseInt(year)
                                    },
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$author',
                                        ],
                                    },
                                },
                            },
                            {$group: {
                            _id: {	author: "$author",
                                },  
                                upvotes: {$sum: 1} 
                                }
                            },
                        ], 
                        as: "answerUpvotes"}
                },
                {
                    $lookup: {
                        from: "posts",
                        let: { id: '$_id' },
                        pipeline: [
                            {$unwind : "$upvoters" },
                            {
                                $project:{
                                    author: 1,
                                    UpvoteMonth: { $month: "$upvoters.createdDate" },
                                    UpvoteYear: { $year: "$upvoters.createdDate" },
                                }
                            },
                            {
                                $match: {
                                    UpvoteMonth: {
                                        $eq: parseInt(month)
                                    },
                                    UpvoteYear: {
                                        $eq: parseInt(year)
                                    },
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$author',
                                        ],
                                    },
                                },
                            },
                            {$group: {
                            _id: {	author: "$author",
                                },  
                                upvotes: {$sum: 1} 
                                }
                            },
                        ], 
                        as: "postsUpvotes"}
                },
                {
                    $project: {
                        name: 1,
                        email: 1,
                        jobTitle: 1,
                        answers: 1,
                        posts: 1,
                        questions: 1,
                        answerUpvotes: 1,
                        postsUpvotes: 1,
                    }
                }
            ]);
            console.log(users);
            const monthlyTopContributors = getMonthlyTopContributors(users, month, year);
            res
                .status(200)
                .json(monthlyTopContributors);
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