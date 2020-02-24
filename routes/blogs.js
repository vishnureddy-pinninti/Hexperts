const mongoose = require('mongoose');
const Space = mongoose.model('spaces');
const Blog = mongoose.model('blogs');
const Comment = mongoose.model('comments');

const { errors: { BLOG_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');
const voting = require('../utils/voting');

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
            });

            await newBlog.save();

            const responseObject = {
                ...newBlog._doc,
                author: req.user,
                space: chosenSpace,
            };

            res
                .status(201)
                .json(responseObject);
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
                { $unwind: '$author' },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'upvoters',
                        foreignField: '_id',
                        as: 'upvoters',
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'downvoters',
                        foreignField: '_id',
                        as: 'downvoters',
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
                { $unwind: '$space' },
            ]);

            if (blog.length) {
                const comments = await Comment.find({ targetID: mongoose.Types.ObjectId(blogID) });

                res
                    .status(200)
                    .json({
                        ...blog[0],
                        commentsCount: comments.length,
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
                    response: e,
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
                    response: e,
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
                    response: e,
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
                const alreadyVoted = voting(blog, _id, 'upvote');

                await blog.save();

                const responseObject = {
                    _id: blogID,
                    upvoter: req.user,
                    removeVoting: alreadyVoted,
                };

                res
                    .status(200)
                    .json(responseObject);
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
                    response: e,
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
                const alreadyVoted = voting(blog, _id);

                await blog.save();

                const responseObject = {
                    _id: blogID,
                    downvoter: req.user,
                    removeVoting: alreadyVoted,
                };

                res
                    .status(200)
                    .json(responseObject);
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
                    response: e,
                });
        }
    });
};
