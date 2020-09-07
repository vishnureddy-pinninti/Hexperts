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

};
