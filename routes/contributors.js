const mongoose = require('mongoose');
const User = mongoose.model('users');
const moment = require('moment');

const getMonthlyTopContributors = require('../utils/getMonthlyTopContributors')

const loginMiddleware = require('../middlewares/loginMiddleware');

module.exports = (app) => {
    app.get('/api/v1/top-contributors', loginMiddleware, async(req, res) => {
        try {
            const users = await User.aggregate([
                { $match: { reputation: { $gt: 0 } } },
                { $sort: { reputation: -1 } },
                { $limit: 3 },
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
                        from: 'comments',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$author',
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
                        comments: {
                            $cond: {
                                if: { $isArray: '$comments' },
                                then: { $size: '$comments' },
                                else: 0,
                            },
                        },
                        reputation: 1,
                        name: 1,
                        email: 1,
                        jobTitle: 1,
                        userid: 1,
                        upvotes: 1,
                    },
                },
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

    app.get('/api/v1/top-contributors-of-month', loginMiddleware, async(req, res) => {
        var previousMonth = moment(new Date()).subtract(1, 'months');
        const month = parseInt(previousMonth.format('M'));
        const year = parseInt(previousMonth.format('YYYY'));
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
                                        $eq: month
                                    },
                                    postedYear: {
                                        $eq: year
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
                                        $eq: month
                                    },
                                    postedYear: {
                                        $eq: year
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
                                        $eq: month
                                    },
                                    postedYear: {
                                        $eq: year
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
                            {$unwind : "$newUpvoters" },
                            {
                                $project:{
                                    author: 1,
                                    UpvoteMonth: { $month: "$newUpvoters.createdDate" },
                                    UpvoteYear: { $year: "$newUpvoters.createdDate" },
                                }
                            },
                            {
                                $match: {
                                    UpvoteMonth: {
                                        $eq: month
                                    },
                                    UpvoteYear: {
                                        $eq: year
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
                            {$unwind : "$newUpvoters" },
                            {
                                $project:{
                                    author: 1,
                                    UpvoteMonth: { $month: "$newUpvoters.createdDate" },
                                    UpvoteYear: { $year: "$newUpvoters.createdDate" },
                                }
                            },
                            {
                                $match: {
                                    UpvoteMonth: {
                                        $eq: month
                                    },
                                    UpvoteYear: {
                                        $eq: year
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
            const monthlyTopContributors = getMonthlyTopContributors(users, month, year).filter(x => x.reputation > 0).splice(0,3);
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
