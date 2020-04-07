const mongoose = require('mongoose');
const Notification = mongoose.model('notifications');

const { errors: { NOTIFICATION_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');

module.exports = (app) => {
    app.get('/api/v1/notifications', loginMiddleware, queryMiddleware, async(req, res) => {
        const { _id } = req.user;
        const {
            pagination,
        } = req.queryParams;

        try {
            const unreadNotifications = await Notification.find({
                recipients: {
                    $elemMatch: {
                        user: mongoose.Types.ObjectId(_id),
                        read: false
                    }
                }
            });
            const notifications = await Notification.aggregate([
                { $match: { 'recipients.user': mongoose.Types.ObjectId(_id) } },
                { $sort: { postedDate: -1 } },
                { $skip: pagination.skip || 0 },
                { $limit: pagination.limit || 10 },
                {
                    $addFields: {
                        recipients: {
                            $filter: {
                                input: '$recipients',
                                as: 'recipient',
                                cond: {
                                    $eq: [
                                        '$$recipient.user',
                                        _id,
                                    ],
                                },
                            },
                        },
                    },
                },
                {
                    $project: {
                        message: 1,
                        postedDate: 1,
                        link: 1,
                        recipient: {
                            $arrayElemAt: [
                                '$recipients',
                                0,
                            ],
                        },
                    },
                },
            ]);

            res
                .status(200)
                .json({
                    unread: unreadNotifications.length,
                    notifications,
                });
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

    app.get('/api/v1/notification-mark-read/:notificationID', loginMiddleware, async(req, res) => {
        const { notificationID } = req.params;
        const { _id } = req.user;

        try {
            const notification = await Notification.findById(notificationID);

            if (notification) {
                notification.recipients = notification.recipients.map((r) => {
                    if (r.user.equals(_id)) {
                        r.read = true;
                        return r;
                    }
                    return r;
                });

                await notification.save();

                res
                    .status(200)
                    .json({ notificationID: _id });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: NOTIFICATION_NOT_FOUND,
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

    app.delete('/api/v1/notification/:notificationID', loginMiddleware, async(req, res) => {
        const { notificationID } = req.params;
        const { _id } = req.user;

        try {
            const notification = await Notification.findById(notificationID);

            if (notification) {
                notification.recipients = notification.recipients.filter((r) => !r.user.equals(_id));
                if (notification.recipients.length === 0) {
                    await notification.remove();
                }
                else {
                    await notification.save();
                }

                res
                    .status(200)
                    .json({ notificationID });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: NOTIFICATION_NOT_FOUND,
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

    app.get('/api/v1/notifications-mark-all-read', loginMiddleware, async(req, res) => {
        const { _id } = req.user;
        try {
            await Notification.updateMany(
                {
                    'recipients.user': mongoose.Types.ObjectId(_id),
                    'recipients.read': false,
                },
                {
                    $set: { 'recipients.$.read': true },
                });

            res
                .status(200)
                .json({
                    response: 'success',
                    read: true,
                });
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
