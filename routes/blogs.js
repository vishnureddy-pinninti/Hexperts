const mongoose = require('mongoose');
const Space = mongoose.model('spaces');
const Blog = mongoose.model('blogs');

const { errors: { BLOG_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const voting = require('../utils/voting');
const emailNotify = require('../services/email/emailService');
const htmlToText = require('../utils/htmlToText');

module.exports = (app) => {
    app.post('/api/v1/blog.add', loginMiddleware, async(req, res) => {
        const {
            space,
            title,
            description,
        } = req.body;

        const { _id } = req.user;

        try {
            const chosenSpace = await Space.findById(mongoose.Types.ObjectId(space));

            const newBlog = new Blog({
                author: _id,
                space,
                title,
                description,
                plainText: htmlToText(description),
            });

            await newBlog.save();

            const responseObject = {
                ...newBlog._doc,
                author: req.user,
                space: chosenSpace,
            };

            emailNotify('newBlog', responseObject);

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

    app.get('/api/v1/blogs', loginMiddleware, queryMiddleware, async(req, res) => {
        const {
            pagination,
        } = req.queryParams;
        const {
            spaces,
        } = req.user;

        try {
            const blogs = await Blog.aggregate([
                { $match: { 'space': { $in: spaces.map((space) => mongoose.Types.ObjectId(space)) } } },
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
                        from: 'spaces',
                        localField: 'space',
                        foreignField: '_id',
                        as: 'space',
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
                .json(blogs);
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

    app.get('/api/v1/blog/:blogID', loginMiddleware, async(req, res) => {
        try {
            const { blogID } = req.params;

            const blog = await Blog.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(blogID) } },
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
                .json(blog[0]);
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

    app.put('/api/v1/blog/:blogID', loginMiddleware, async(req, res) => {
        try {
            const { blogID } = req.params;
            const {
                title,
                description,
            } = req.body;

            const blog = await Blog.findById(blogID);

            if (blog) {
                const responseObject = { _id: blogID };

                if (title) {
                    blog.title = title;
                    responseObject.title = title;
                }

                if (description) {
                    blog.description = description;
                    blog.plainText = htmlToText(description);
                    responseObject.description = description;
                }

                blog.lastModified = Date.now();

                await blog.save();
                res
                    .status(200)
                    .json({
                        ...responseObject,
                        lastModified: blog.lastModified,
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

    app.delete('/api/v1/blog/:blogID', loginMiddleware, async(req, res) => {
        try {
            const { blogID } = req.params;
            const blog = await Blog.findById(blogID);

            if (blog) {
                await blog.remove();
                res
                    .status(200)
                    .json({ blogID });
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

    app.get('/api/v1/blog-upvote/:blogID', loginMiddleware, async(req, res) => {
        const {
            blogID,
        } = req.params;

        const { _id } = req.user;

        try {
            const blog = await Blog.findById(blogID);

            if (blog) {
                const { alreadyVoted, secondaryVoted } = voting(blog, _id, 'upvote');

                await blog.save();

                const responseObject = {
                    _id: blogID,
                    upvoter: req.user,
                    removeVoting: alreadyVoted,
                };

                emailNotify('upvoteBlog', {
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

    app.get('/api/v1/blog-downvote/:blogID', loginMiddleware, async(req, res) => {
        const {
            blogID,
        } = req.params;

        const { _id } = req.user;

        try {
            const blog = await Blog.findById(blogID);

            if (blog) {
                const { alreadyVoted, secondaryVoted } = voting(blog, _id);

                await blog.save();

                const responseObject = {
                    _id: blogID,
                    downvoter: req.user,
                    removeVoting: alreadyVoted,
                };

                emailNotify('downvoteBlog', {
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
};
