const mongoose = require('mongoose');
const Question = mongoose.model('questions');

const { errors: { QUESTION_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');

module.exports = (app) => {
    app.post('/api/v1/answer.add', loginMiddleware, async(req, res) => {
        const {
            answer,
            author,
            questionID,
        } = req.body;

        try {
            const question = await Question.findById(questionID);
            if (question) {
                question.answers = [
                    ...question.answers,
                    {
                        answer,
                        author,
                    },
                ];
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

    app.get('/api/v1/answers/:questionID', loginMiddleware, async(req, res) => {
        const {
            questionID,
        } = req.params;

        try {
            const question = await Question.findById(questionID);
            if (question) {
                res
                    .status(200)
                    .json(question.answers);
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
