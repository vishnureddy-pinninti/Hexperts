const mongoose = require('mongoose');
const Answer = mongoose.model('answers');

const { errors: { ANSWER_NOT_FOUND, QUESTION_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');

const handleVoting = (answer, user, voting) => {
    const main = voting === 'upvote' ? 'upvoters' : 'downvoters';
    const secondary = voting === 'upvote' ? 'downvoters' : 'upvoters';
    
    const alreadyVoted = answer[main].find(v => v.userid === user.userid);
    
    if (alreadyVoted) {
        answer[main] = answer[main].filter(v => v.userid !== user.userid);
    }
    else {
        answer[main] = [ ...answer[main], user ];
        answer[secondary] = answer[secondary].filter(v => v.userid !== user.userid)
    }
};

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

    // TODO
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

    app.put('/api/v1/answers/:answerID', loginMiddleware, async(req, res) => {
        try {
            const { answerID } = req.params;
            const answer = await Answer.findById(answerID);

            if (answer) {
                Object.keys(req.body).forEach((x) => { answer[x] = req.body[x]; });
                answer.lastModified = Date.now();

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

    app.get('/api/v1/answer-upvote/:answerID', loginMiddleware, async(req, res) => {
        const {
            answerID,
        } = req.params;

        try {
            const answer = await Answer.findById(answerID);

            if (answer) {
                handleVoting(answer, req.user, 'upvote');

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
                        response: ANSWER_NOT_FOUND
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
                handleVoting(answer, req.user);

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
                        response: ANSWER_NOT_FOUND
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
