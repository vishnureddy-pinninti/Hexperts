const mongoose = require('mongoose');
const Answer = mongoose.model('answers');

const { errors: { ANSWER_NOT_FOUND } } = require('../utils/constants');
const voting = require('../utils/voting');
const loginMiddleware = require('../middlewares/loginMiddleware');

module.exports = (app) => {
    app.post('/api/v1/answer.add', loginMiddleware, async(req, res) => {
        const {
            answer,
            questionID,
        } = req.body;

        const newAnswer = new Answer({
            answer,
            author: req.user,
            questionID: mongoose.Types.ObjectId(questionID),
        });

        try {
            await newAnswer.save();
            res
                .status(201)
                .json(newAnswer);
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

    app.put('/api/v1/answers/:answerID', loginMiddleware, async(req, res) => {
        try {
            const { answerID } = req.params;
            const { answer: answerString } = req.body;

            const answer = await Answer.findById(answerID);

            if (answer) {
                if (answerString) {
                    answer.answer = answerString;
                    answer.lastModified = Date.now();
                }

                await answer.save();
                res
                    .status(200)
                    .json(answer);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: ANSWER_NOT_FOUND,
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

    app.delete('/api/v1/answers/:answerID', loginMiddleware, async(req, res) => {
        try {
            const { answerID } = req.params;
            const answer = await Answer.findById(answerID);

            if (answer) {
                await answer.remove();
                res
                    .status(200)
                    .json({ answerID });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: ANSWER_NOT_FOUND,
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

    app.get('/api/v1/answer-upvote/:answerID', loginMiddleware, async(req, res) => {
        const {
            answerID,
        } = req.params;

        try {
            const answer = await Answer.findById(answerID);

            if (answer) {
                voting(answer, req.user, 'upvote');

                await answer.save();
                res
                    .status(200)
                    .json(answer);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: ANSWER_NOT_FOUND,
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

    app.get('/api/v1/answer-downvote/:answerID', loginMiddleware, async(req, res) => {
        const {
            answerID,
        } = req.params;

        try {
            const answer = await Answer.findById(answerID);

            if (answer) {
                voting(answer, req.user);

                await answer.save();
                res
                    .status(200)
                    .json(answer);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: ANSWER_NOT_FOUND,
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
