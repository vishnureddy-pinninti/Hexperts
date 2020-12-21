const mongoose = require('mongoose');
const Feedback = mongoose.model('feedbacks');

const feedbackService = require('../services/feedback/feedbackService');
const loginMiddleware = require('../middlewares/loginMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');


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

    app.get('/api/v1/feedbacks', loginMiddleware, adminMiddleware, async(req, res) => {

        try {
            const feedbacks = await Feedback.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'author',
                        foreignField: '_id',
                        as: 'author',
                    },
                },
                {
                  "$unwind": "$author"
                },
                {
                    $project: {
                        author: 1,
                        lastModified: 1,
                        postedDate: 1,
                        subject: 1,
                        description: 1,
                        isAddressed: 1,
                    },
                },
            ]);
            var userFeedbacks = [];
            feedbacks.forEach((feedback) => {
                userFeedbacks.push({
                    user: feedback.author.name,
                    email: feedback.author.email,
                    jobTitle: feedback.author.jobTitle,
                    department: feedback.author.department,
                    city: feedback.author.city,
                    lastModified: feedback.lastModified,
                    postedDate: feedback.postedDate,
                    subject: feedback.subject,
                    description: feedback.description,
                    isAddressed: feedback.isAddressed,
                })
            })
            const feedbackInfo ={ departments : [...new Set(userFeedbacks.map(user => user.department))],
                jobTitles : [...new Set(userFeedbacks.map(user => user.jobTitle))],
                location : [...new Set(userFeedbacks.map(user => user.city))],
                userFeedbacks
                }
            res
                .status(200)
                .json(feedbackInfo);
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