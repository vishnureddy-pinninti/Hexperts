const mongoose = require('mongoose');
const User = mongoose.model('users');
const Topic = mongoose.model('topics');

const { encrypt } = require('../utils/crypto');
const config = require('../config/keys');
const loginMiddleware = require('../middlewares/loginMiddleware');
const { errors: { USER_NOT_FOUND, TOPIC_NOT_FOUND } } = require('../utils/constants');

module.exports = (app) => {
    app.post('/api/v1/user.read', async(req, res) => {
        const {
            displayName,
            id,
            jobTitle,
            mail,
        } = req.body;

        try {
            const user = await User.aggregate([
                { $match: { userid: id } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'followers',
                        foreignField: '_id',
                        as: 'followers',
                    },
                },
                {
                    $lookup: {
                        from: 'topics',
                        localField: 'interests',
                        foreignField: '_id',
                        as: 'interests',
                    },
                },
            ]);

            let cookieUser;

            if (user.length) {
                cookieUser = user[0];
            }
            else {
                const newUser = new User({
                    name: displayName,
                    email: mail,
                    jobTitle,
                    userid: id,
                });

                await newUser.save();

                cookieUser = newUser;
            }

            // Create cookie and send the response back
            const d1 = new Date();
            d1.setHours(d1.getHours() + 240);
            const cookieOptions = {
                httpOnly: true,
                expires: d1,
            };
            cookieOptions.path = '/';

            res
                .cookie(config.cookieKey, encrypt(JSON.stringify(cookieUser)), cookieOptions)
                .status(200)
                .json(cookieUser);
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

    app.get('/api/v1/user-profile', loginMiddleware, async(req, res) => {
        const { _id } = req.user;

        try {
            const user = await User.findById(_id);

            if (user) {
                const following = await User.aggregate([
                    { $match: { 'followers': mongoose.Types.ObjectId(_id) } },
                    { $count: 'following' },
                ]);

                res
                    .status(200)
                    .json({
                        ...user._doc,
                        following: following[0] && following[0].following || 0,
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: USER_NOT_FOUND,
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

    app.post('/api/v1/user.follow', loginMiddleware, async(req, res) => {
        const {
            _id,
        } = req.body;

        try {
            const user = await User.findById(_id);

            if (user) {
                const isFollowing = user.followers.find((follower) => follower.equals(req.user._id));

                if (isFollowing) {
                    user.followers = user.followers.filter((follower) => !follower.equals(req.user._id));
                }
                else {
                    user.followers = [
                        ...user.followers,
                        req.user._id,
                    ];
                }

                await user.save();
                res
                    .status(200)
                    .json({
                        _id,
                        follower: req.user,
                        unfollow: Boolean(isFollowing),
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: USER_NOT_FOUND,
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

    app.get('/api/v1/user-followers', loginMiddleware, async(req, res) => {
        const { _id } = req.user;

        try {
            const userFollowers = await User.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(_id) } },
                { $unwind: '$followers' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'followers',
                        foreignField: '_id',
                        as: 'followers',
                    },
                },
                { $unwind: '$followers' },
                {
                    $group: {
                        _id: '$_id',
                        followers: { $push: '$followers' },
                    },
                },
            ]);

            res
                .status(200)
                .json(userFollowers[0] || {
                    _id,
                    followers: [],
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

    app.get('/api/v1/user-following', loginMiddleware, async(req, res) => {
        const { _id } = req.user;

        try {
            const usersFollowing = await User.find({ followers: mongoose.Types.ObjectId(_id) });

            res
                .status(200)
                .json(usersFollowing);
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

    app.post('/api/v1/user-interests.manage', loginMiddleware, async(req, res) => {
        const {
            interestId,
        } = req.body;

        const {
            _id,
        } = req.user;

        try {
            const user = await User.findById(_id);
            const interest = await Topic.findById(interestId);

            if (user && interest) {
                const isFollowing = user.interests.find((uinterest) => uinterest.equals(interestId));

                if (isFollowing) {
                    user.interests = user.interests.filter((uinterest) => !uinterest.equals(interestId));
                }
                else {
                    user.interests = [
                        ...user.interests,
                        interest,
                    ];
                }

                await user.save();
                res
                    .status(200)
                    .json({
                        _id,
                        interest,
                        interestRemoved: Boolean(isFollowing),
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: TOPIC_NOT_FOUND,
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

    app.post('/api/v1/user.update', loginMiddleware, async(req, res) => {
        const {
            interests,
        } = req.body;

        const {
            _id,
        } = req.user;

        try {
            const user = await User.findById(_id);

            if (user) {
                user.interests = interests;

                await user.save();

                res
                    .status(200)
                    .json(user);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: USER_NOT_FOUND,
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
