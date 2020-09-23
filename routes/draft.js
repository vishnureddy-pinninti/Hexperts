const mongoose = require('mongoose');
const Draft = mongoose.model('drafts');
const Post = mongoose.model('posts');
const Topic = mongoose.model('topics');

const { errors: { DRAFT_NOT_FOUND } } = require('../utils/constants');
const loginMiddleware = require('../middlewares/loginMiddleware');
const emailNotify = require('../services/email/emailService');
const { updateService } = require('../services/common');
const htmlToText = require('../utils/htmlToText');
const { inBButNotInA } = require('../utils/common');

module.exports = (app) => {
    app.post('/api/v1/draft.add', loginMiddleware, async(req, res) => {
        const {
            title,
            description,
            topics = [],
        } = req.body;

        const { _id } = req.user;

        try {
            // const chosenBlog = await Blog.findById(mongoose.Types.ObjectId(blog));
            const chosenTopics = await Topic.find({ _id: { $in: topics.map((topic) => mongoose.Types.ObjectId(topic)) } });

            const { plainText, userMentions } = htmlToText(description);
            const newDraft = new Draft({
                author: _id,
                topics: chosenTopics.map((t) => t._id),
                title,
                description,
                plainText,
            });

            await newDraft.save();

            const responseObject = {
                ...newDraft._doc,
                author: req.user,
                topics,
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

    app.get('/api/v1/drafts', loginMiddleware, async(req, res) => {
        const {
            _id,
        } = req.user;

        try {
            //const draft = await Draft.find({ author: mongoose.Types.ObjectId(_id) });
            const draft = await Draft.aggregate([
                { $match: { author: mongoose.Types.ObjectId(_id) } },
                { $sort: { postedDate: -1 } },
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
                        lastModified: 1,
                        plainText: 1,
                        postedDate: 1,
                        topics: 1,
                        title: 1,
                        description: 1,
                    },
                },
            ]);

            res
                .status(200)
                .json(draft);
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

    app.get('/api/v1/draft/:draftId', loginMiddleware, async(req, res) => {
        try {
            const { draftId } = req.params;
            const draft = await Draft.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(draftId) } },
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
                        plainText: 1,
                        postedDate: 1,
                        lastModified: 1,
                        topics: 1,
                        title: 1,
                        description: 1,
                    },
                },
            ]);

            if (draft.length) {
                res
                    .status(200)
                    .json(draft[0]);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: DRAFT_NOT_FOUND,
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

    app.put('/api/v1/draft/:draftId', loginMiddleware, async(req, res) => {
        try {
            const { draftId } = req.params;
            const {
                title,
                description,
                topics,
            } = req.body;

            const draft = await Draft.findById(draftId);

            if (draft) {
                let edited = false;
                const responseObject = { _id: draftId };

                if (title) {
                    draft.title = title;
                    responseObject.title = title;
                    edited = true;
                }
                
                if (description) {
                    const { plainText, userMentions } = htmlToText(description);
                    updateService(draft.description, description);
                    draft.description = description;
                    draft.plainText = plainText;
                    responseObject.description = description;
                    responseObject.plainText = plainText;
                    edited = true;
                }

                if (topics) {
                    const chosenTopics = await Topic.find({ _id: { $in: topics.map((topic) => mongoose.Types.ObjectId(topic)) } });
                    draft.topics = topics;
                    responseObject.topics = chosenTopics;
                }

                if (edited) {
                    draft.lastModified = Date.now();
                    responseObject.lastModified = draft.lastModified;
                }

                await draft.save();
                res
                    .status(200)
                    .json(responseObject);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: DRAFT_NOT_FOUND,
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

    app.delete('/api/v1/draft/:draftId', loginMiddleware, async(req, res) => {
        try {
            const { draftId } = req.params;
            const draft = await Draft.findById(draftId);

            if (draft) {
                await draft.remove();
                res
                    .status(200)
                    .json({ draft });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: DRAFT_NOT_FOUND,
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

    app.post('/api/v1/postDraft.add/:draftId', loginMiddleware, async(req, res) => {
        try {
            const { xorigin } = req.headers;
            const { draftId } = req.params;
            const { _id } = req.user;
            
            const {
                title,
                description,
                topics,
            } = req.body;

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

            const draft = await Draft.findById(draftId);

            if (draft) {
                await draft.remove();
                res
                    .status(201)
                    .json(responseObject);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: DRAFT_NOT_FOUND,
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
