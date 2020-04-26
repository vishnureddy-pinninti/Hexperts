const mongoose = require('mongoose');
const Answer = mongoose.model('answers');

const { errors: { ANSWER_NOT_FOUND } } = require('../utils/constants');
const voting = require('../utils/voting');
const loginMiddleware = require('../middlewares/loginMiddleware');
const emailNotify = require('../services/email/emailService');
const { deleteService, updateService } = require('../services/common');
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
                                            '$targetID',
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
                        commentsCount: {
                            $cond: {
                                if: { $isArray: '$comments' },
                                then: { $size: '$comments' },
                                else: 0,
                            },
                        },
                        answer: 1,
                        author: 1,
                        downvoters: 1,
                        plainText: 1,
                        postedDate: 1,
                        questionID: 1,
                        question: 1,
                        upvoters: 1,
                    },
                },
            ]);

            if (answer[0]) {
                res
                    .status(200)
                    .json(answer[0]);
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

    app.put('/api/v1/answers/:answerID', loginMiddleware, async(req, res) => {
        try {
            const { answerID } = req.params;
            const { answer: answerString } = req.body;

            const answer = await Answer.findById(answerID);

            if (answer) {
                const plainText = htmlToText(answerString);
                if (answerString || answerString === '') {
                    updateService(answer.answer, answerString);
                    answer.answer = answerString;
                    answer.plainText = plainText;
                    answer.lastModified = Date.now();
                    emailNotify('editAnswer', {
                        plainText,
                        _id: answerID,
                        questionID: answer.questionID,
                        req: req.io,
                    }, {
                        author: req.user,
                    });
                }

                await answer.save();
                res
                    .status(200)
                    .json({
                        _id: answerID,
                        answer: answerString,
                        plainText,
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
                deleteService({
                    type: 'answer',
                    user: answer.author,
                    voteCount: answer.upvoters.length,
                    htmlContent: answer.answer,
                });
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
