const mongoose = require('mongoose');
const { errors: { QUESTION_NOT_FOUND } } = require('../utils/constants');

const Question = mongoose.model('questions');

module.exports = (app) => {
    app.post('/api/v1/question.add', async(req, res) => {
        const {
            author,
            suggestedExperts,
            tags,
            question,
        } = req.body;
        const newQuestion = new Question({
            author,
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

    app.get('/api/v1/questions', async(req, res) => {
        try {
            const questions = await Question.find({});
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

    app.get('/api/v1/question/:id', async(req, res) => {
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

    app.put('/api/v1/question/:id', async(req, res) => {
        try {
            const { id } = req.params;
            const question = await Question.findById(id);
            if (question) {
                Object.keys(req.body).forEach((x) => { question[x] = req.body[x]; });
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

    app.delete('/api/v1/question/:id', async(req, res) => {
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
};
