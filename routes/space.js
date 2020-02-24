const mongoose = require('mongoose');
const Space = mongoose.model('spaces');
const Blog = mongoose.model('blogs');
const User = mongoose.model('users');

const { errors: { SPACE_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');

module.exports = (app) => {
    app.post('/api/v1/space.add', loginMiddleware, async(req, res) => {
        const {
            name,
            description,
        } = req.body;

        const { _id } = req.user;

        try {
            const existingSpace = await Space.findOne({ name: new RegExp(`^${name}$`, 'i') });

            if (existingSpace) {
                res
                    .status(400)
                    .json({
                        error: true,
                        response: 'Space with this name already exists',
                    });
                return;
            }
            const newSpace = new Space({
                name,
                description,
                author: _id,
            });

            await newSpace.save();

            const responseObject = {
                ...newSpace._doc,
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
                    response: e,
                });
        }
    });

    app.get('/api/v1/spaces', loginMiddleware, async(req, res) => {
        try {
            const spaces = await Space.find({});
            res
                .status(200)
                .json(spaces);
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

    app.get('/api/v1/spaces/:spaceID', loginMiddleware, queryMiddleware, async(req, res) => {
        const { spaceID } = req.params;
        const {
            pagination,
        } = req.queryParams;

        try {
            const space = await Space.findById(spaceID);

            if (space) {
                const blogs = await Blog.aggregate([
                    { $match: { 'space': mongoose.Types.ObjectId(spaceID) } },
                    {
                        $lookup: {
                            from: 'users',
                            localField: 'author',
                            foreignField: '_id',
                            as: 'author',
                        },
                    },
                    { $unwind: '$author' },
                    { $sort: { postedDate: -1 } },
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
                                { $count: 'commentsCount' },
                            ],
                            as: 'comments',
                        },
                    },
                    // { $unwind: '$comments' },
                    { $skip: pagination.skip || 0 },
                    { $limit: pagination.limit || 10 },
                ]);

                const followers = await User.aggregate([
                    { $match: { 'spaces': mongoose.Types.ObjectId(spaceID) } },
                    { $count: 'following' },
                ]);

                const response = {
                    ...space._doc,
                    blogs,
                    followers: followers[0] && followers[0].following || 0,
                };

                res
                    .status(200)
                    .json(response);
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
                    response: e,
                });
        }
    });

    app.put('/api/v1/space/:spaceID', loginMiddleware, async(req, res) => {
        try {
            const { spaceID } = req.params;
            const {
                name,
                imageUrl,
                description,
            } = req.body;

            const space = await Space.findById(spaceID);
            const responseObject = { _id: spaceID };

            if (space) {
                if (name) {
                    space.name = name;
                    responseObject.name = name;
                }

                if (imageUrl) {
                    space.imageUrl = imageUrl;
                    responseObject.imageUrl = imageUrl;
                }

                if (description) {
                    space.description = description;
                    responseObject.description = description;
                }

                space.lastModified = Date.now();

                await space.save();
                res
                    .status(200)
                    .json({
                        ...responseObject,
                        lastModified: space.lastModified,
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
                    response: e,
                });
        }
    });
};
