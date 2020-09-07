const mongoose = require('mongoose');
const Feedback = mongoose.model('feedbacks');

const htmlToText = require('../utils/htmlToText');
const feedbackService = require('../services/feedback/feedbackService');
const loginMiddleware = require('../middlewares/loginMiddleware');


module.exports = (app) => {
    app.post('/api/v1/feedback.add', loginMiddleware, async(req, res) => {
        const {
            subject,
            description,
        } = req.body;
        const { _id } = req.user;

        try {
            const newFeedback = new Feedback({
                author: _id,
                subject,
                description,
            });

            await newFeedback.save();

            const responseObject = {
                subject,
                description,
                user: req.user,
            };
            feedbackService(responseObject);

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
}