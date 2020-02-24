const mongoose = require('mongoose');
const Question = mongoose.model('questions');
const Topic = mongoose.model('topics');

const loginMiddleware = require('../middlewares/loginMiddleware');

module.exports = (app) => {
    app.post('/api/v1/search', loginMiddleware, async(req, res) => {
        const { text } = req.body;
        try {
            const results = await Question.aggregate([
                { $match: { $text: { $search: text } } },
                { $addFields: { score: { $meta: 'textScore' } } },
                { $sort: { score: { $meta: 'textScore' } } },
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
                            { $count: 'answersCount' },
                        ],
                        as: 'answers',
                    },
                },
                {
                    $project: {
                        question: 1,
                        score: 1,
                        answers: 1,
                    },
                },
            ]);
            res
                .status(200)
                .json(results);
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

    app.post('/api/v1/topic-search', loginMiddleware, async(req, res) => {
        const { text } = req.body;
        try {
            let results = await Topic.aggregate([
                { $match: { $text: { $search: text } } },
                { $addFields: { score: { $meta: 'textScore' } } },
                { $sort: { score: { $meta: 'textScore' } } },
            ]);

            if (!results.length) {
                results = await Topic.find({ topic: new RegExp(text, 'gi') });
            }

            res
                .status(200)
                .json(results);
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
