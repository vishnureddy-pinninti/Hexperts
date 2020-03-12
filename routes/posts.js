const mongoose = require('mongoose');
const Blog = mongoose.model('blogs');
const Post = mongoose.model('posts');

const { errors: { POST_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const voting = require('../utils/voting');
const emailNotify = require('../services/email/emailService');
const htmlToText = require('../utils/htmlToText');

module.exports = (app) => {
    app.post('/api/v1/post.add', loginMiddleware, async(req, res) => {
        const {
            blog,
            title,
            description,
        } = req.body;

        const { _id } = req.user;

        try {
            const chosenBlog = await Blog.findById(mongoose.Types.ObjectId(blog));

            const newPost = new Post({
                author: _id,
                blog,
                title,
                description,
                plainText: htmlToText(description),
            });

            await newPost.save();

            const responseObject = {
                ...newPost._doc,
                author: req.user,
                blog: chosenBlog,
            };

            emailNotify('newPost', responseObject);

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
            blogs,
        } = req.user;

        try {
            const posts = await Post.aggregate([
                { $match: { 'blog': { $in: blogs.map((blog) => mongoose.Types.ObjectId(blog)) } } },
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
                {
                    $lookup: {
                        from: 'blogs',
                        localField: 'blog',
                        foreignField: '_id',
                        as: 'blog',
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
                        postedDate: 1,
                        blog: 1,
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
                {
                    $lookup: {
                        from: 'blogs',
                        localField: 'blog',
                        foreignField: '_id',
                        as: 'blog',
                    },
                },
                {
                    $unwind: {
                        path: '$blog',
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
                        author: 1,
                        downvoters: 1,
                        lastModified: 1,
                        postedDate: 1,
                        blog: 1,
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
                .json(post[0]);
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
            const { postID } = req.params;
            const {
                title,
                description,
            } = req.body;

            const post = await Post.findById(postID);

            if (post) {
                const responseObject = { _id: postID };

                if (title) {
                    post.title = title;
                    responseObject.title = title;
                }

                if (description) {
                    post.description = description;
                    post.plainText = htmlToText(description);
                    responseObject.description = description;
                }

                post.lastModified = Date.now();

                await post.save();
                res
                    .status(200)
                    .json({
                        ...responseObject,
                        lastModified: post.lastModified,
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

    app.delete('/api/v1/post/:postID', loginMiddleware, async(req, res) => {
        try {
            const { postID } = req.params;
            const post = await post.findById(postID);

            if (post) {
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
