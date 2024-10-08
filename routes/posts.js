const mongoose = require('mongoose');
// const Blog = mongoose.model('blogs');
const Post = mongoose.model('posts');
const User = mongoose.model('users');
const Topic = mongoose.model('topics');

const { errors: { POST_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const voting = require('../utils/voting');
const emailNotify = require('../services/email/emailService');
const { deleteService, updateService } = require('../services/common');
const htmlToText = require('../utils/htmlToText');
const { inBButNotInA } = require('../utils/common');

module.exports = (app) => {
    app.post('/api/v1/post.add', loginMiddleware, async(req, res) => {
        const {
            // blog,
            title,
            description,
            topics = [],
        } = req.body;

        const { _id } = req.user;
        const { xorigin } = req.headers;

        try {
            // const chosenBlog = await Blog.findById(mongoose.Types.ObjectId(blog));
            const chosenTopics = await Topic.find({ _id: { $in: topics.map((topic) => mongoose.Types.ObjectId(topic)) } });

            const { plainText, userMentions } = htmlToText(description);
            const newPost = new Post({
                author: _id,
                // blog,
                topics: chosenTopics.map((t) => t._id),
                title,
                description,
                plainText,
            });

            await newPost.save();

            const responseObject = {
                ...newPost._doc,
                author: req.user,
                topics,
            };

            emailNotify('newPost', {
                ...responseObject,
                req: req.io,
                origin: xorigin,
                userMentions,
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

    app.get('/api/v1/posts', loginMiddleware, queryMiddleware, async(req, res) => {
        const {
            pagination,
        } = req.queryParams;
        const {
            // blogs = [],
            interests = [],
            _id,
        } = req.user;

        const dbUser = await User.aggregate([
            { $match: { _id: mongoose.Types.ObjectId(_id) } },
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
        ]);

        const query = {
            $or: [
                // { blog: { $in: blogs.map((blog) => mongoose.Types.ObjectId(blog)) } },
                { topics: { $in: interests.map((interest) => mongoose.Types.ObjectId(interest)) } },
                { author: { $in: [ ...dbUser[0].following.map((f) => mongoose.Types.ObjectId(f._id)), mongoose.Types.ObjectId(_id) ] } },
            ],
        };

        try {
            const posts = await Post.aggregate([
                { $match: query },
                { $sort: { postedDate: -1 } },
                { $skip: pagination.skip || 0 },
                { $limit: pagination.limit || 10 },
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
                // {
                //     $lookup: {
                //         from: 'blogs',
                //         localField: 'blog',
                //         foreignField: '_id',
                //         as: 'blog',
                //     },
                // },
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
                        author: 1,
                        downvoters: 1,
                        lastModified: 1,
                        plainText: 1,
                        postedDate: 1,
                        // blog: 1,
                        topics: 1,
                        title: 1,
                        description: 1,
                        upvoters: '$newUpvoters',
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
                .json(posts);
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

    app.get('/api/v1/post/:postID', loginMiddleware, async(req, res) => {
        try {
            const { postID } = req.params;

            const post = await Post.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(postID) } },
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
                // {
                //     $lookup: {
                //         from: 'blogs',
                //         localField: 'blog',
                //         foreignField: '_id',
                //         as: 'blog',
                //     },
                // },
                // {
                //     $unwind: {
                //         path: '$blog',
                //         preserveNullAndEmptyArrays: true,
                //     },
                // },
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
                        author: 1,
                        downvoters: 1,
                        lastModified: 1,
                        plainText: 1,
                        postedDate: 1,
                        topics: 1,
                        title: 1,
                        description: 1,
                        upvoters: '$newUpvoters',
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

            if (post.length) {
                res
                    .status(200)
                    .json(post[0]);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: POST_NOT_FOUND,
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

    app.put('/api/v1/post/:postID', loginMiddleware, async(req, res) => {
        try {
            const { xorigin } = req.headers;
            const { postID } = req.params;
            const {
                title,
                description,
                topics,
            } = req.body;

            const post = await Post.findById(postID);

            if (post) {
                let edited = false;
                const responseObject = { _id: postID };

                if (title) {
                    post.title = title;
                    responseObject.title = title;
                    edited = true;
                }

                let newMentions = [];
                let allMentions = [];
                
                if (description) {
                    const { plainText, userMentions } = htmlToText(description);
                    const { userMentions: oldUserMentions } = htmlToText(post.description);
                    mentions = userMentions.slice();
                    newMentions = inBButNotInA(oldUserMentions, userMentions);
                    updateService(post.description, description);
                    post.description = description;
                    post.plainText = plainText;
                    responseObject.description = description;
                    responseObject.plainText = plainText;
                    edited = true;
                }

                if (topics) {
                    const chosenTopics = await Topic.find({ _id: { $in: topics.map((topic) => mongoose.Types.ObjectId(topic)) } });
                    post.topics = topics;
                    responseObject.topics = chosenTopics;
                }

                if (edited) {
                    post.lastModified = Date.now();
                    responseObject.lastModified = post.lastModified;
                    emailNotify('editPost', {
                        author: req.user,
                        topics: post.topics,
                        title: post.title,
                        _id: post._id,
                        req: req.io,
                        origin: xorigin,
                        userMentions: newMentions,
                        allMentions,
                    });
                }

                await post.save();
                res
                    .status(200)
                    .json(responseObject);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: POST_NOT_FOUND,
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

    app.delete('/api/v1/post/:postID', loginMiddleware, async(req, res) => {
        try {
            const { postID } = req.params;
            const post = await Post.findById(postID);

            if (post) {
                deleteService({
                    type: 'post',
                    user: post.author,
                    voteCount: post.newUpvoters.length,
                    htmlContent: post.description,
                });
                await post.remove();
                res
                    .status(200)
                    .json({ postID });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: POST_NOT_FOUND,
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

    app.get('/api/v1/post-upvote/:postID', loginMiddleware, async(req, res) => {
        const {
            postID,
        } = req.params;

        const { _id } = req.user;
        const { xorigin } = req.headers;

        try {
            const post = await Post.findById(postID);

            if (post) {
                const { alreadyVoted, secondaryVoted } = voting(post, _id, 'upvote');

                await post.save();

                const responseObject = {
                    _id: postID,
                    upvoter: req.user,
                    removeVoting: alreadyVoted,
                };

                emailNotify('upvotePost', {
                    ...responseObject,
                    req: req.io,
                    origin: xorigin,
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
                        response: POST_NOT_FOUND,
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

    app.get('/api/v1/post-downvote/:postID', loginMiddleware, async(req, res) => {
        const {
            postID,
        } = req.params;

        const { _id } = req.user;
        const { xorigin } = req.headers;

        try {
            const post = await Post.findById(postID);

            if (post) {
                const { alreadyVoted, secondaryVoted } = voting(post, _id);

                await post.save();

                const responseObject = {
                    _id: postID,
                    downvoter: req.user,
                    removeVoting: alreadyVoted,
                };

                emailNotify('downvotePost', {
                    ...responseObject,
                    req: req.io,
                    origin: xorigin,
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
                        response: POST_NOT_FOUND,
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
