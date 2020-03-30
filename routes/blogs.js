const mongoose = require('mongoose');
const Blog = mongoose.model('blogs');
const Topic = mongoose.model('topics');

const { errors: { BLOG_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const upload = require('../utils/uploads');

module.exports = (app) => {
    app.post('/api/v1/blog.add', loginMiddleware, upload.any(), async(req, res) => {
        const {
            name,
            description,
        } = req.body;

        const { _id } = req.user;

        try {
            const existingBlog = await Blog.findOne({ name: new RegExp(`^${name}$`, 'i') });

            if (existingBlog) {
                res
                    .status(400)
                    .json({
                        error: true,
                        response: 'Blog with this name already exists',
                    });
                return;
            }
            const newBlog = new Blog({
                name,
                description,
                plainText: description,
                author: _id,
                imageUrl: req.files && req.files.length && `/api/v1/images/${req.files[0].filename}`,
            });

            await newBlog.save();

            const responseObject = {
                ...newBlog._doc,
                author: req.user,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.get('/api/v1/blogs', loginMiddleware, async(req, res) => {
        try {
            const blogs = await Blog.find({});
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

    app.get('/api/v1/blogs/:topicID', loginMiddleware, queryMiddleware, async(req, res) => {
        const { topicID } = req.params;
        const {
            pagination,
        } = req.queryParams;

        try {
            const blog = await Topic.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(topicID) } },
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
                                            '$interests',
                                        ],
                                    },
                                },
                            },
                            {
                                $project: {
                                    _id: 1,
                                },
                            },
                        ],
                        as: 'followers',
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
                        from: 'posts',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: [
                                            '$$id',
                                            '$topics',
                                        ],
                                    },
                                },
                            },
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
                                    from: 'topics',
                                    localField: 'topics',
                                    foreignField: '_id',
                                    as: 'topics',
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
                                    downvoters: 1,
                                    lastModified: 1,
                                    postedDate: 1,
                                    topics: 1,
                                    title: 1,
                                    description: 1,
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
                        ],
                        as: 'posts',
                    },
                },
                {
                    $project: {
                        author: 1,
                        topic: 1,
                        lastModified: 1,
                        createdDate: 1,
                        imageUrl: 1,
                        description: 1,
                        posts: 1,
                        followers: {
                            $cond: {
                                if: { $isArray: '$followers' },
                                then: {
                                    $map: {
                                        input: '$followers',
                                        as: 'follower',
                                        in: '$$follower._id',
                                    },
                                },
                                else: [],
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

    app.put('/api/v1/blog/:blogID', loginMiddleware, upload.any(), async(req, res) => {
        try {
            const { blogID } = req.params;
            const {
                name,
                description,
            } = req.body;

            const blog = await Blog.findById(blogID);
            const responseObject = { _id: blogID };

            if (blog) {
                if (name) {
                    blog.name = name;
                    responseObject.name = name;
                }

                if (req.files.length) {
                    blog.imageUrl = `/api/v1/images/${req.files[0].filename}`;
                    responseObject.imageUrl = `/api/v1/images/${req.files[0].filename}`;
                }

                if (description) {
                    blog.description = description;
                    blog.plainText = description;
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
};
