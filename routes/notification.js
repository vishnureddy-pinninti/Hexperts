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
            const notifications = await Notification.aggregate([
                { $match: { recipient: mongoose.Types.ObjectId(_id) } },
                { $sort: { postedDate: -1 } },
                { $skip: pagination.skip || 0 },
                { $limit: pagination.limit || 10 },
            ]);

            res
                .status(200)
                .json(notifications);
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

    app.get('/api/v1/notification-mark-read/:notificationID', loginMiddleware, async(req, res) => {
        const { notificationID } = req.params;
        try {
            const notification = await Notification.findById(notificationID);

            if (notification) {
                notification.read = true;
                notification.lastModified = Date.now();

                await notification.save();

                res
                    .status(200)
                    .json(notification);
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
                    response: e,
                });
        }
    });

    app.delete('/api/v1/notification/:notificationID', loginMiddleware, async(req, res) => {
        const { notificationID } = req.params;
        try {
            const notification = await Notification.findById(notificationID);

            if (notification) {
                await notification.remove();

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
                    response: e,
                });
        }
    });

    app.get('/api/v1/notifications-mark-all-read', loginMiddleware, async(req, res) => {
        try {
            const notifications = await Notification.aggregate([
                { $match: { read: false } },
                { $project: { _id: 1 } },
            ]);
            await Notification.updateMany(
                { read: false },
                {
                    $set: { read: true },
                    $currentDate: { lastModified: true },
                });

            res
                .status(200)
                .json({
                    notifications,
                    read: true,
                });
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
