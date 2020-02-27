const mongoose = require('mongoose');
const User = mongoose.model('users');

const loginMiddleware = require('../middlewares/loginMiddleware');

module.exports = (app) => {
    app.get('/api/v1/top-contributors', loginMiddleware, async(req, res) => {
        try {
            const users = await User.aggregate([
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
                            { $count: 'answersCount' },
                        ],
                        as: 'answers',
                    },
                },
                {
                    $lookup: {
                        from: 'blogs',
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
                            { $count: 'blogsCount' },
                        ],
                        as: 'blogs',
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
                            { $count: 'commentsCount' },
                        ],
                        as: 'comments',
                    },
                },
                {
                    $project: {
                        answers: {
                            $arrayElemAt: [
                                '$answers',
                                0,
                            ],
                        },
                        blogs: {
                            $arrayElemAt: [
                                '$blogs',
                                0,
                            ],
                        },
                        comments: {
                            $arrayElemAt: [
                                '$comments',
                                0,
                            ],
                        },
                        reputation: 1,
                        name: 1,
                        email: 1,
                        jobTitle: 1,
                        userid: 1,
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
                    response: e,
                });
        }
    });
};
