const mongoose = require('mongoose');
const User = mongoose.model('users');
const Topic = mongoose.model('topics');
const Space = mongoose.model('spaces');
const Notification = mongoose.model('notifications');
const Question = mongoose.model('questions');
const Answer = mongoose.model('answers');
const Blog = mongoose.model('blogs');

const { encrypt } = require('../utils/crypto');
const config = require('../config/keys');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const {
    errors: {
        USER_NOT_FOUND, TOPIC_NOT_FOUND, SPACE_NOT_FOUND, UNAUTHORIZED,
    },
} = require('../utils/constants');

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
                        from: 'topics',
                        localField: 'interests',
                        foreignField: '_id',
                        as: 'interests',
                    },
                },
                {
                    $lookup: {
                        from: 'topics',
                        localField: 'expertIn',
                        foreignField: '_id',
                        as: 'expertIn',
                    },
                },
                {
                    $lookup: {
                        from: 'spaces',
                        localField: 'spaces',
                        foreignField: '_id',
                        as: 'spaces',
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

                cookieUser = newUser._doc;
            }

            const notifications = await Notification.find({
                recipient: mongoose.Types.ObjectId(cookieUser._id),
                read: false,
            });

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
                .json({
                    ...cookieUser,
                    notificationCount: notifications.length,
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

    app.get('/api/v1/user-profile/:userID', loginMiddleware, async(req, res) => {
        const { userID } = req.params;

        try {
            const user = await User.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(userID) } },
                {
                    $lookup: {
                        from: 'topics',
                        localField: 'interests',
                        foreignField: '_id',
                        as: 'interests',
                    },
                },
                {
                    $lookup: {
                        from: 'topics',
                        localField: 'expertIn',
                        foreignField: '_id',
                        as: 'expertIn',
                    },
                },
                {
                    $lookup: {
                        from: 'spaces',
                        localField: 'spaces',
                        foreignField: '_id',
                        as: 'spaces',
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: [
                                            '$$id',
                                            '$followers',
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'following',
                    },
                },
                {
                    $lookup: {
                        from: 'questions',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$author',
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'questions',
                    },
                },
                {
                    $lookup: {
                        from: 'answers',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$author',
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'answers',
                    },
                },
                {
                    $lookup: {
                        from: 'blogs',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$author',
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'blogs',
                    },
                },
                {
                    $project: {
                        following: {
                            $cond: {
                                if: { $isArray: '$following' },
                                then: { $size: '$following' },
                                else: 0,
                            },
                        },
                        followers: {
                            $cond: {
                                if: { $isArray: '$followers' },
                                then: { $size: '$followers' },
                                else: 0,
                            },
                        },
                        emailSubscription: 1,
                        name: 1,
                        email: 1,
                        jobTitle: 1,
                        userid: 1,
                        reputation: 1,
                        spaces: 1,
                        expertIn: 1,
                        interests: 1,
                        questions: {
                            $cond: {
                                if: { $isArray: '$questions' },
                                then: { $size: '$questions' },
                                else: 0,
                            },
                        },
                        answers: {
                            $cond: {
                                if: { $isArray: '$answers' },
                                then: { $size: '$answers' },
                                else: 0,
                            },
                        },
                        blogs: {
                            $cond: {
                                if: { $isArray: '$blogs' },
                                then: { $size: '$blogs' },
                                else: 0,
                            },
                        },
                    },
                },
            ]);

            res
                .status(200)
                .json(user[0]);
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
                        follower: req.user._id,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.get('/api/v1/user-followers/:userID', loginMiddleware, async(req, res) => {
        const { userID } = req.params;

        try {
            const userFollowers = await User.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(userID) } },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'followers',
                        foreignField: '_id',
                        as: 'followers',
                    },
                },
                {
                    $project: {
                        followers: 1,
                    },
                },
            ]);

            res
                .status(200)
                .json(userFollowers[0]);
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

    app.get('/api/v1/user-following/:userID', loginMiddleware, async(req, res) => {
        const { userID } = req.params;

        try {
            const following = await User.find({ followers: mongoose.Types.ObjectId(userID) });

            res
                .status(200)
                .json({
                    _id: userID,
                    following,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.post('/api/v1/user-spaces.manage', loginMiddleware, async(req, res) => {
        const {
            spaceId,
        } = req.body;

        const {
            _id,
        } = req.user;

        try {
            const user = await User.findById(_id);
            const space = await Space.findById(spaceId);

            if (user && space) {
                const isFollowing = user.spaces.find((uspace) => uspace.equals(spaceId));

                if (isFollowing) {
                    user.spaces = user.spaces.filter((uspace) => !uspace.equals(spaceId));
                }
                else {
                    user.spaces = [
                        ...user.spaces,
                        spaceId,
                    ];
                }

                await user.save();
                res
                    .status(200)
                    .json({
                        _id,
                        space,
                        spaceRemoved: Boolean(isFollowing),
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: SPACE_NOT_FOUND,
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

    app.post('/api/v1/user-preferences.add', loginMiddleware, async(req, res) => {
        const {
            interests = [],
            expertIn = [],
        } = req.body;

        const {
            _id,
        } = req.user;

        try {
            const user = await User.findById(_id);
            const interestedTopics = await Topic.find({ _id: { $in: interests } });
            const expertInTopics = await Topic.find({ _id: { $in: expertIn } });

            if (user) {
                interests.forEach((interest) => user.interests.addToSet(interest));
                expertIn.forEach((expert) => user.expertIn.addToSet(expert));

                await user.save();

                res
                    .status(200)
                    .json({
                        _id,
                        interests: interestedTopics,
                        expertIn: expertInTopics,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.delete('/api/v1/user-expertise-remove/:topicID', loginMiddleware, async(req, res) => {
        const {
            topicID,
        } = req.params;

        const {
            _id,
        } = req.user;

        try {
            const user = await User.findById(_id);

            if (user) {
                user.expertIn = user.expertIn.filter((expertIn) => !expertIn.equals(topicID));

                await user.save();

                res
                    .status(200)
                    .json({
                        _id,
                        topicID,
                        expertiseRemoved: true,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.get('/api/v1/email/subscription', loginMiddleware, async(req, res) => {
        const { _id } = req.user;

        try {
            const user = await User.findById(_id);

            if (user) {
                user.emailSubscription = !user.emailSubscription;

                await user.save();

                res
                    .status(200)
                    .json({
                        _id,
                        emailSubscription: user.emailSubscription,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.get('/api/v1/user-questions/:userID', loginMiddleware, queryMiddleware, async(req, res) => {
        const { userID } = req.params;
        const {
            pagination,
        } = req.queryParams;

        try {
            const questions = await Question.aggregate([
                { $match: { author: mongoose.Types.ObjectId(userID) } },
                { $sort: { postedDate: -1 } },
                { $skip: pagination.skip || 0 },
                { $limit: pagination.limit || 10 },
                {
                    $lookup: {
                        from: 'topics',
                        localField: 'topics',
                        foreignField: '_id',
                        as: 'topics',
                    },
                },
                {
                    $lookup: {
                        from: 'answers',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$questionID',
                                        ],
                                    },
                                },
                            },
                        ],
                        as: 'answers',
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
                    $project: {
                        author: 1,
                        followers: 1,
                        lastModified: 1,
                        postedDate: 1,
                        suggestedExperts: 1,
                        topics: 1,
                        question: 1,
                        description: 1,
                        answers: {
                            $cond: {
                                if: { $isArray: '$answers' },
                                then: { $size: '$answers' },
                                else: 0,
                            },
                        },
                    },
                },
            ]);

            res
                .status(200)
                .json({
                    _id: userID,
                    questions,
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

    app.get('/api/v1/user-answers/:userID', loginMiddleware, queryMiddleware, async(req, res) => {
        const { userID } = req.params;
        const {
            pagination,
        } = req.queryParams;

        try {
            const answers = await Answer.aggregate([
                { $match: { author: mongoose.Types.ObjectId(userID) } },
                { $sort: { postedDate: -1 } },
                { $skip: pagination.skip || 0 },
                { $limit: pagination.limit || 10 },
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
                    $project: {
                        answer: 1,
                        author: 1,
                        downvoters: 1,
                        lastModified: 1,
                        postedDate: 1,
                        upvoters: 1,
                        questionID: '$question._id',
                        question: '$question.question',
                    },
                },
            ]);

            res
                .status(200)
                .json({
                    _id: userID,
                    answers,
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

    app.get('/api/v1/user-blogs/:userID', loginMiddleware, queryMiddleware, async(req, res) => {
        const { userID } = req.params;
        const {
            pagination,
        } = req.queryParams;

        try {
            const blogs = await Blog.aggregate([
                { $match: { author: mongoose.Types.ObjectId(userID) } },
                { $sort: { postedDate: -1 } },
                { $skip: pagination.skip || 0 },
                { $limit: pagination.limit || 10 },
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
                        from: 'spaces',
                        localField: 'space',
                        foreignField: '_id',
                        as: 'space',
                    },
                },
                {
                    $unwind: {
                        path: '$space',
                        preserveNullAndEmptyArrays: true,
                    },
                },
                {
                    $project: {
                        author: 1,
                        downvoters: 1,
                        lastModified: 1,
                        postedDate: 1,
                        space: 1,
                        title: 1,
                        description: 1,
                        upvoters: 1,
                        comments: {
                            $cond: {
                                if: { $isArray: '$comments' },
                                then: { $size: '$comments' },
                                else: 0,
                            },
                        },
                    },
                },
            ]);

            res
                .status(200)
                .json({
                    _id: userID,
                    blogs,
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

    app.post('/api/v1/grant-admin-access', loginMiddleware, async(req, res) => {
        const { role } = req.user;

        if (role === 'admin') {
            try {
                const { userid } = req.body;
                const user = await User.findById(mongoose.Types.ObjectId(userid));

                if (user) {
                    user.role = 'admin';

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
                        response: String(e),
                        stack: e.stack,
                    });
            }
        }
        else {
            res
                .status(403)
                .json({
                    error: true,
                    response: UNAUTHORIZED,
                });
        }
    });

    app.post('/api/v1/revoke-admin-access', loginMiddleware, async(req, res) => {
        const { role } = req.user;

        if (role === 'admin') {
            try {
                const { userid } = req.body;
                const user = await User.findById(mongoose.Types.ObjectId(userid));

                if (user) {
                    user.role = 'user';

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
                        response: String(e),
                        stack: e.stack,
                    });
            }
        }
        else {
            res
                .status(403)
                .json({
                    error: true,
                    response: UNAUTHORIZED,
                });
        }
    });
};
