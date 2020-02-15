const mongoose = require('mongoose');
const { errors: { QUESTION_NOT_FOUND } } = require('../utils/constants');

const Question = mongoose.model('questions');
const loginMiddleware = require('../middlewares/loginMiddleware');

module.exports = (app) => {
    app.post('/api/v1/question.add', loginMiddleware, async(req, res) => {
        const {
            userid,
        } = req.user;
        const {
            suggestedExperts,
            tags,
            question,
        } = req.body;
        const newQuestion = new Question({
            author: userid,
            suggestedExperts,
            tags,
            question,
        });

        try {
            await newQuestion.save();
            res
                .status(201)
                .json(newQuestion);
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

    app.get('/api/v1/questions', loginMiddleware, async(req, res) => {
        const {
            limit,
            skip,
            ...rest
        } = req.query;
        const {
            userid,
        } = req.user;
        const query = { author: userid };

        if (rest) {
            Object.keys(rest).forEach((x) => {
                const fields = rest[x].split(',');
                if (fields.length) {
                    query[x] = { $in: fields };
                }
                else {
                    query[x] = rest[x];
                }
            });
        }

        try {
            const questions = await Question.find(query, { answers: 0 }, {
                skip: Number(skip),
                limit: Number(limit),
            });
            res
                .status(200)
                .json(questions);
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

    app.get('/api/v1/question/:id', loginMiddleware, async(req, res) => {
        try {
            const { id } = req.params;
            const question = await Question.findById(id);
            if (question) {
                res
                    .status(200)
                    .json(question);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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

    app.put('/api/v1/question/:id', loginMiddleware, async(req, res) => {
        try {
            const { id } = req.params;
            const question = await Question.findById(id);
            if (question) {
                Object.keys(req.body).forEach((x) => { question[x] = req.body[x]; });
                question.lastModified = Date.now();
                await question.save();
                res
                    .status(200)
                    .json(question);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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

    app.delete('/api/v1/question/:id', loginMiddleware, async(req, res) => {
        try {
            const { id } = req.params;
            const question = await Question.findById(id);
            if (question) {
                await question.remove();
                res
                    .status(200)
                    .json({ id });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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

    app.post('/api/v1/question.follow', loginMiddleware, async(req, res) => {
        const {
            follower,
            questionID,
        } = req.body;

        try {
            const question = await Question.findById(questionID);
            if (question) {
                question.followers = [
                    ...question.followers,
                    follower,
                ];
                await question.save();
                res
                    .status(200)
                    .json({
                        follower,
                        questionID,
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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

    app.post('/api/v1/question.unfollow', loginMiddleware, async(req, res) => {
        const {
            follower,
            questionID,
        } = req.body;

        try {
            const question = await Question.findById(questionID);
            if (question) {
                question.followers = question.followers.filter((f) => f !== follower);
                await question.save();
                res
                    .status(200)
                    .json({
                        follower,
                        questionID,
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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
};
