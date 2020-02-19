const mongoose = require('mongoose');
const Question = mongoose.model('questions');
const User = mongoose.model('users');

const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');

module.exports = (app) => {
    app.get('/api/v1/tags', loginMiddleware, async(req, res) => {
        try {
            const tags = await Question.distinct('tags');
            res
                .status(200)
                .json({ tags });
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
            query,
        } = req.queryParams;

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
