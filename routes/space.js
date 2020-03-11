const mongoose = require('mongoose');
const Space = mongoose.model('spaces');

const { errors: { SPACE_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const htmlToText = require('../utils/htmlToText');

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
                plainText: htmlToText(description),
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
                    response: String(e),
                    stack: e.stack,
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });

    app.get('/api/v1/spaces/:spaceID', loginMiddleware, queryMiddleware, async(req, res) => {
        const { spaceID } = req.params;
        const {
            pagination,
        } = req.queryParams;

        try {
            const space = await Space.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(spaceID) } },
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
                                            '$spaces',
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
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [
                                            '$$id',
                                            '$space',
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
                        ],
                        as: 'blogs',
                    },
                },
                {
                    $project: {
                        author: 1,
                        name: 1,
                        lastModified: 1,
                        createdDate: 1,
                        imageUrl: 1,
                        description: 1,
                        blogs: 1,
                        following: {
                            $cond: {
                                if: { $isArray: '$following' },
                                then: { $size: '$following' },
                                else: 0,
                            },
                        },
                    },
                },
            ]);

            res
                .status(200)
                .json(space[0]);
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
                    space.plainText = htmlToText(description);
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
                    response: String(e),
                    stack: e.stack,
                });
        }
    });
};
