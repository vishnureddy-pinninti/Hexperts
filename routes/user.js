const mongoose = require('mongoose');
const User = mongoose.model('users');
const Topic = mongoose.model('topics');
const Blog = mongoose.model('blogs');
const Notification = mongoose.model('notifications');
const Question = mongoose.model('questions');
const Answer = mongoose.model('answers');
const Post = mongoose.model('posts');

const { encrypt } = require('../utils/crypto');
const config = require('../config/keys');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const emailNotify = require('../services/email/emailService');
const { emailPreferenceTypes } = require('../services/email/emailUtils');
const {
    errors: {
        USER_NOT_FOUND, TOPIC_NOT_FOUND, BLOG_NOT_FOUND, UNAUTHORIZED, INCORRECT_EMAIL_CATEGORY,
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
                        from: 'blogs',
                        localField: 'blogs',
                        foreignField: '_id',
                        as: 'blogs',
                    },
                },
                {
                    $project: {
                        followers: 1,
                        emailSubscription: 1,
                        name: 1,
                        email: 1,
                        jobTitle: 1,
                        userid: 1,
                        reputation: 1,
                        blogs: 1,
                        expertIn: 1,
                        interests: 1,
                        upvotes: 1,
                        role: 1,
                    },
                },
            ]);

            let cookieUser;
            let resUser;

            if (user.length) {
                resUser = user[0];
                cookieUser = {
                    _id: user[0]._id,
                };
            }
            else {
                const newUser = new User({
                    name: displayName,
                    email: mail,
                    jobTitle,
                    userid: id,
                });

                await newUser.save();

                resUser = newUser._doc;
                cookieUser = {
                    _id: newUser._doc._id,
                };
            }

            const notifications = await Notification.find({
                recipients: {
                    $elemMatch: {
                        user: mongoose.Types.ObjectId(cookieUser._id),
                        read: false
                    }
                }
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
                    ...resUser,
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
                        from: 'blogs',
                        localField: 'blogs',
                        foreignField: '_id',
                        as: 'blogs',
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
                        from: 'posts',
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
                        as: 'posts',
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
                        followers: 1,
                        emailSubscription: 1,
                        emailPreferences: {
                            $cond: {
                                if: { $isArray: '$emailPreferences' },
                                then: '$emailPreferences',
                                else: [],
                            },
                        },
                        name: 1,
                        email: 1,
                        jobTitle: 1,
                        userid: 1,
                        reputation: 1,
                        blogs: 1,
                        expertIn: 1,
                        interests: 1,
                        upvotes: 1,
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
                        posts: {
                            $cond: {
                                if: { $isArray: '$posts' },
                                then: { $size: '$posts' },
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
        const { xorigin } = req.headers;

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

                const responseObject = {
                    _id,
                    follower: req.user,
                    unfollow: Boolean(isFollowing),
                };

                if (!Boolean(isFollowing)) {
                    emailNotify('followUser', {
                        ...responseObject,
                        req: req.io,
                        origin: xorigin,
                    });
                }

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
            expertId,
        } = req.body;

        const {
            _id,
        } = req.user;

        try {
            const user = await User.findById(_id);
            const topicId = interestId || expertId;
            const topic = await Topic.findById(topicId);

            if (user && topic) {
                const responseObject = {
                    _id,
                    interest: topic,
                };

                const isFollowing = user.interests.find((uinterest) => uinterest.equals(topicId));

                if (expertId) {
                    const isExpertin = user.expertIn.find((uinterest) => uinterest.equals(topicId));
                    responseObject.expertIn = topic;

                    if (isExpertin) {
                        user.expertIn = user.expertIn.filter((uinterest) => !uinterest.equals(topicId));
                        responseObject.expertInRemoved = true;
                    }
                    else {
                        user.expertIn = [
                            ...user.expertIn,
                            topic,
                        ];

                        if (!isFollowing) {
                            user.interests = [
                                ...user.interests,
                                topic,
                            ];
                        }

                        responseObject.expertInRemoved = false;
                    }
                    responseObject.interestRemoved = false;
                }
                else {
                    if (isFollowing) {
                        user.interests = user.interests.filter((uinterest) => !uinterest.equals(topicId));
                        responseObject.interestRemoved = true;
                    }
                    else {
                        user.interests = [
                            ...user.interests,
                            topic,
                        ];
                        responseObject.interestRemoved = false;
                    }
                }

                await user.save();
                res
                    .status(200)
                    .json(responseObject);
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

    app.post('/api/v1/user-blogs.manage', loginMiddleware, async(req, res) => {
        const {
            blogID,
        } = req.body;

        const {
            _id,
        } = req.user;

        try {
            const user = await User.findById(_id);
            const blog = await Blog.findById(blogID);

            if (user && blog) {
                const isFollowing = user.blogs.find((blog) => blog.equals(blogID));

                if (isFollowing) {
                    user.blogs = user.blogs.filter((blog) => !blog.equals(blogID));
                }
                else {
                    user.blogs = [
                        ...user.blogs,
                        blogID,
                    ];
                }

                await user.save();
                res
                    .status(200)
                    .json({
                        _id,
                        blog,
                        blogRemoved: Boolean(isFollowing),
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: BLOG_NOT_FOUND,
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
            blogs = [],
        } = req.body;

        const {
            _id,
        } = req.user;

        try {
            const user = await User.findById(_id);
            const interestedTopics = await Topic.find({ _id: { $in: interests } });
            const expertInTopics = await Topic.find({ _id: { $in: expertIn } });
            const chosenBlogs = await Blog.find({ _id: { $in: blogs } });

            if (user) {
                interests.forEach((interest) => user.interests.addToSet(interest));
                expertIn.forEach((expert) => user.expertIn.addToSet(expert));
                blogs.forEach((blog) => user.blogs.addToSet(blog));

                await user.save();

                res
                    .status(200)
                    .json({
                        _id,
                        interests: interestedTopics,
                        expertIn: expertInTopics,
                        blogs: chosenBlogs,
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

    app.post('/api/v1/user-preferences.manage', loginMiddleware, async(req, res) => {
        const {
            blogs,
            interests,
            expertIn,
        } = req.body;

        const {
            _id,
        } = req.user;

        try {
            const user = await User.findById(_id);

            if (user) {
                const responseObject = { _id };

                if (interests) {
                    user.interests = interests;
                    responseObject.interests = await Topic.find({ _id: { $in: interests } });
                }
                if (expertIn) {
                    user.expertIn = expertIn;
                    responseObject.expertIn = await Topic.find({ _id: { $in: expertIn } });
                }

                if (blogs) {
                    user.blogs = blogs;
                    responseObject.blogs = await Blog.find({ _id: { $in: blogs } });
                }

                await user.save();

                res
                    .status(200)
                    .json(responseObject);
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

    app.get('/api/v1/email-preferences', loginMiddleware, async (req, res) => {
        const { _id } = req.user;

        try {
            const user = await User.findById(_id);

            if (user) {
                res
                    .status(200)
                    .json({
                        _id,
                        emailSubscription: user.emailSubscription,
                        emailPreferences: user.emailPreferences || [],
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

    app.post('/api/v1/email-preferences.manage', loginMiddleware, async (req, res) => {
        const { _id } = req.user;
        const { category } = req.body;

        try {
            const isValidCategory = emailPreferenceTypes.indexOf(category) > -1;
            const user = await User.findById(_id);

            if (user && isValidCategory) {
                const emailPreferences =  user.emailPreferences || [];
                user.emailPreferences = emailPreferences.indexOf(category) > -1 ?
                                        emailPreferences.filter(p => p !== category) :
                                        [ ...emailPreferences, category ];

                await user.save();

                res
                    .status(200)
                    .json({
                        _id,
                        emailPreferences: user.emailPreferences,
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: isValidCategory ? USER_NOT_FOUND : INCORRECT_EMAIL_CATEGORY,
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
                            {
                                $project: {
                                    answer: 1,
                                    author: 1,
                                    downvoters: 1,
                                    postedDate: 1,
                                    lastModified: 1,
                                    questionID: 1,
                                    upvoters: 1,
                                    upvotersCount: 1,
                                },
                            },
                            {
                                $facet: {
                                    results: [
                                        {
                                            $limit: 1,
                                        },
                                    ],
                                    totalCount: [
                                        {
                                            $count: 'count',
                                        },
                                    ],
                                },
                            },
                            {
                                $unwind: {
                                    path: '$totalCount',
                                    preserveNullAndEmptyArrays: true,
                                },
                            },
                            {
                                $project: {
                                    results: 1,
                                    totalCount: {
                                        $cond: {
                                            if: {
                                                $eq: [
                                                    { $type: '$totalCount' },
                                                    'object',
                                                ],
                                            },
                                            then: '$totalCount.count',
                                            else: 0,
                                        },
                                    },
                                },
                            },
                        ],
                        as: 'answers',
                    },
                },
                {
                    $unwind: {
                        path: '$answers',
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
                        author: 1,
                        followers: 1,
                        lastModified: 1,
                        postedDate: 1,
                        suggestedExperts: 1,
                        topics: 1,
                        question: 1,
                        description: 1,
                        answers: 1,
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
                { $addFields: { upvotersCount: { $size: '$upvoters' } } },
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
                        lastModified: 1,
                        postedDate: 1,
                        questionID: 1,
                        upvoters: 1,
                        upvotersCount: 1,
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

    app.get('/api/v1/user-posts/:userID', loginMiddleware, queryMiddleware, async(req, res) => {
        const { userID } = req.params;
        const {
            pagination,
        } = req.queryParams;

        try {
            const posts = await Post.aggregate([
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
                        from: 'topics',
                        localField: 'topics',
                        foreignField: '_id',
                        as: 'topics',
                    },
                },
                {
                    $project: {
                        author: 1,
                        downvoters: 1,
                        lastModified: 1,
                        postedDate: 1,
                        topics: 1,
                        title: 1,
                        description: 1,
                        plainText:1,
                        upvoters: 1,
                        commentsCount: {
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
                    posts,
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

    app.post('/api/v1/grant-admin-access', loginMiddleware, adminMiddleware, async(req, res) => {
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
    });

    app.post('/api/v1/revoke-admin-access', loginMiddleware, adminMiddleware, async(req, res) => {
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
    });
};
