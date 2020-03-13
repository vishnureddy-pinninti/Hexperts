const mongoose = require('mongoose');
const Answer = mongoose.model('answers');

const { errors: { ANSWER_NOT_FOUND } } = require('../utils/constants');
const voting = require('../utils/voting');
const loginMiddleware = require('../middlewares/loginMiddleware');
const emailNotify = require('../services/email/emailService');
const htmlToText = require('../utils/htmlToText');

module.exports = (app) => {
    app.post('/api/v1/answer.add', loginMiddleware, async(req, res) => {
        const {
            answer,
            questionID,
        } = req.body;

        const { _id } = req.user;

        const newAnswer = new Answer({
            answer,
            author: mongoose.Types.ObjectId(_id),
            plainText: htmlToText(answer),
            questionID: mongoose.Types.ObjectId(questionID),
        });

        try {
            await newAnswer.save();

            const responseObject = {
                ...newAnswer._doc,
                author: req.user,
            };
            emailNotify('newAnswer', {
                ...responseObject,
                req: req.io,
            }, {
                author: req.user,
            });

            res
                .status(201)
                .json(responseObject);
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

    app.get('/api/v1/answers/:answerID', loginMiddleware, async(req, res) => {
        try {
            const { answerID } = req.params;

            const answer = await Answer.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(answerID) } },
                {
                    $lookup: {
                        from: 'questions',
                        let: { id: '$questionID' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$_id',
                                        ],
                                    },
                                },
                            },
                            {
                                $lookup: {
                                    from: 'users',
                                    localField: 'author',
                                    foreignField: '_id',
                                    as: 'author',
                                },
                            },
                            {
                                $unwind: {
                                    path: '$author',
                                    preserveNullAndEmptyArrays: true,
                                },
                            },
                            {
                                $lookup: {
                                    from: 'topics',
                                    localField: 'topics',
                                    foreignField: '_id',
                                    as: 'topics',
                                },
                            },
                        ],
                        as: 'question',
                    },
                },
                {
                    $unwind: {
                        path: '$question',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author',
                    },
                },
                {
                    $unwind: {
                        path: '$author',
                        preserveNullAndEmptyArrays: true,
                    },
                },
            ]);

            res
                .status(200)
                .json(answer[0]);
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

    app.put('/api/v1/answers/:answerID', loginMiddleware, async(req, res) => {
        try {
            const { answerID } = req.params;
            const { answer: answerString } = req.body;

            const answer = await Answer.findById(answerID);

            if (answer) {
                if (answerString) {
                    answer.answer = answerString;
                    answer.plainText = htmlToText(answerString);
                    answer.lastModified = Date.now();
                }

                await answer.save();
                res
                    .status(200)
                    .json({
                        _id: answerID,
                        answer: answerString,
                        lastModified: answer.lastModified,
                    });
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
                    response: String(e),
                    stack: e.stack,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.get('/api/v1/answer-upvote/:answerID', loginMiddleware, async(req, res) => {
        const {
            answerID,
        } = req.params;

        const { _id } = req.user;

        try {
            const answer = await Answer.findById(answerID);

            if (answer) {
                const { alreadyVoted, secondaryVoted } = voting(answer, _id, 'upvote');

                await answer.save();

                const responseObject = {
                    _id: answerID,
                    upvoter: req.user,
                    removeVoting: alreadyVoted,
                };
                emailNotify('upvoteAnswer', {
                    ...responseObject,
                    req: req.io,
                    secondaryVoted,
                });

                res
                    .status(200)
                    .json({
                        ...responseObject,
                        upvoter: _id,
                    });
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.get('/api/v1/answer-downvote/:answerID', loginMiddleware, async(req, res) => {
        const {
            answerID,
        } = req.params;

        const { _id } = req.user;

        try {
            const answer = await Answer.findById(answerID);

            if (answer) {
                const { alreadyVoted, secondaryVoted } = voting(answer, _id);

                await answer.save();

                const responseObject = {
                    _id: answerID,
                    downvoter: req.user,
                    removeVoting: alreadyVoted,
                };
                emailNotify('downvoteAnswer', {
                    ...responseObject,
                    req: req.io,
                    secondaryVoted,
                });

                res
                    .status(200)
                    .json({
                        ...responseObject,
                        downvoter: _id,
                    });
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });
};
