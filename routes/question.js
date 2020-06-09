const mongoose = require('mongoose');
const Question = mongoose.model('questions');
const Answer = mongoose.model('answers');
const User = mongoose.model('users');
const Topic = mongoose.model('topics');

const { errors: { QUESTION_NOT_FOUND } } = require('../utils/constants');
const emailNotify = require('../services/email/emailService');
const { deleteService, updateService } = require('../services/common');
const loginMiddleware = require('../middlewares/loginMiddleware');
const queryMiddleware = require('../middlewares/queryMiddleware');
const htmlToText = require('../utils/htmlToText');
const { search } = require('../utils/search');
const ANSWERED = 'answered';
const ANSWEREDBYME = 'answeredbyme';
const UNANSWERED = 'unanswered';
const availableTypes = [ ANSWERED, ANSWEREDBYME, UNANSWERED ];
const { inBButNotInA } = require('../utils/common');

const updateTopicsInAnswers = async (questionID, topics) => {
    const answers = await Answer.find({ questionID });

    answers.forEach(async (a) => {
        const answer = await Answer.findById(a._id);

        answer.topics = topics;

        await answer.save();
    });
}

module.exports = (app) => {
    app.post('/api/v1/question.add', loginMiddleware, async(req, res) => {
        const {
            suggestedExperts = [],
            topics = [],
            question,
            description,
        } = req.body;

        const { _id } = req.user;
        const { xorigin } = req.headers;

        try {
            const chosenTopics = await Topic.find({ _id: { $in: topics.map((topic) => mongoose.Types.ObjectId(topic)) } });
            const { plainText, userMentions } = htmlToText(description);
            const newQuestion = new Question({
                author: _id,
                suggestedExperts,
                topics: chosenTopics.map((t) => t._id),
                question,
                description,
                plainText,
            });

            await newQuestion.save();

            const responseObject = {
                ...newQuestion._doc,
                author: req.user,
                topics: chosenTopics || [],
            };
            emailNotify('newQuestion', {
                ...responseObject,
                req: req.io,
                origin: xorigin,
                userMentions,
            }, {
                author: req.user,
                suggestedExperts,
                topics,
            });

            if (suggestedExperts.length) {
                emailNotify('suggestedExpert', {
                    ...responseObject,
                    req: req.io,
                    origin: xorigin,
                }, {
                    author: req.user,
                    suggestedExperts,
                });
            }

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

    app.post('/api/v1/question-suggestions', loginMiddleware, async(req, res) => {
        const {
            question,
        } = req.body;

        try {
            const { results: topicSuggestions } = await search({
                text: question,
                categories: [ 'topics' ],
                exclude: false,
            });
            const { results: questionSuggestions } = await search({
                text: question,
                categories: [ 'questions' ],
                exclude: false,
                sfield: [ 'question' ],
            });

            res
                .status(200)
                .json({
                    question,
                    questionSuggestions: questionSuggestions.map(q => ({ value: q.options.question, _id: q._id })),
                    topicSuggestions: topicSuggestions.map(t => ({ value: t.options.topic, _id: t._id })),
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

    app.get('/api/v1/questions', loginMiddleware, queryMiddleware, async(req, res) => {
        const {
            custom,
            query,
            pagination,
        } = req.queryParams;
        const {
            _id,
        } = req.user;

        const aggregationMatch = Object.keys(query).map((key) => { return { [key]: query[key] }; });
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

        if (custom._onlyInterests) {
            aggregationMatch.push({
                $or: [
                    {
                        $or: [
                            { topics: { $in: dbUser[0].interests } },
                            { topics: { $in: dbUser[0].expertIn } },
                        ],
                    },
                    { followers: mongoose.Types.ObjectId(_id) },
                    { author: { $in: dbUser[0].following.map((f) => mongoose.Types.ObjectId(f._id)) } },
                ],
            });
        }

        if (custom._onlySuggested) {
            aggregationMatch.push({ suggestedExperts: mongoose.Types.ObjectId(_id) });
        }

        if (custom._onlyExpertIn) {
            aggregationMatch.push({ topics: { $in: dbUser[0].expertIn } });
        }

        if (custom._ownQuestions) {
            aggregationMatch.push({ author: mongoose.Types.ObjectId(_id) });
        }

        if (!aggregationMatch.length) {
            res
                .status(200)
                .json([]);
            return;
        }

        try {
            const questions = await Question.aggregate([
                { $match: { $and: aggregationMatch } },
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
                        from: 'users',
                        localField: 'suggestedExperts',
                        foreignField: '_id',
                        as: 'suggestedExperts',
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
                                $sort: {
                                    upvotersCount: -1,
                                    postedDate: -1,
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
                                    plainText: 1,
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
                    $project: {
                        followers: 1,
                        suggestedExperts: 1,
                        topics: 1,
                        author: 1,
                        question: 1,
                        description: 1,
                        plainText: 1,
                        postedDate: 1,
                        lastModified: 1,
                        answers: 1,
                    },
                },
            ]);

            res
                .status(200)
                .json(questions);
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

    app.get('/api/v1/expertin-questions/:type', loginMiddleware, queryMiddleware, async(req, res) => {
        const { type } = req.params;

        if (!availableTypes.includes(type)) {
            return res
                    .status(400)
                    .json({
                        error: true,
                        response: 'Provided type not supported',
                    });
        }
        try {
            const {
                _id,
                expertIn,
            } = req.user;
            const {
                custom,
                pagination,
            } = req.queryParams;

            let mainMatch;

            if (!custom._onlySuggested && !custom._onlyExpertIn) {
                return res
                    .status(400)
                    .json({
                        error: true,
                        response: 'Provided custom type not supported',
                    });
            }

            if (custom._onlySuggested) {
                mainMatch = { suggestedExperts: mongoose.Types.ObjectId(_id) };
            }
    
            if (custom._onlyExpertIn) {
                mainMatch = { topics: { $in: expertIn } };
            }

            const answerLookupMatch = [
                {
                    $expr: {
                        $eq: [
                            '$$id',
                            '$questionID',
                        ],
                    },
                }
            ];

            let finalMatch = { $gt: 0 };

            if (type === ANSWEREDBYME) {
                answerLookupMatch.push({ author: mongoose.Types.ObjectId(_id) });
            }

            if (type === UNANSWERED) {
                finalMatch = 0;
            }

            const questions = await Question.aggregate([
                {
                    $match: mainMatch
                },
                { $sort: { postedDate: -1 } },
                {
                    $lookup: {
                        from: 'answers',
                        let: { id: '$_id' },
                        pipeline: [
                            {
                                $match: {
                                    $and: answerLookupMatch,
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
                                $sort: {
                                    upvotersCount: -1,
                                    postedDate: -1,
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
                                    plainText: 1,
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
                    $match: {
                        'answers.totalCount': finalMatch,
                    }
                },
                { $skip: pagination.skip || 0 },
                { $limit: pagination.limit || 10 },
                {
                    $project: {
                        followers: 1,
                        suggestedExperts: 1,
                        topics: 1,
                        author: 1,
                        question: 1,
                        description: 1,
                        plainText: 1,
                        postedDate: 1,
                        lastModified: 1,
                        answers: 1,
                    },
                },
            ]);

            res
                .status(200)
                .json(questions);
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

    app.get('/api/v1/trending-questions', loginMiddleware, async(req, res) => {
        try {
            const questions = await Answer.aggregate([
                {
                    $group: {
                        _id: '$questionID',
                        count: { $sum: 1 },
                    },
                },
                { $sort: { count: -1 } },
                { $limit: 10 },
                {
                    $lookup: {
                        from: 'questions',
                        localField: '_id',
                        foreignField: '_id',
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
                    $project: {
                        question: '$question.question',
                    },
                },
            ]);

            res
                .status(200)
                .json(questions);
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

    app.get('/api/v1/related-questions', loginMiddleware, queryMiddleware, async(req, res) => {
        const {
            query,
        } = req.queryParams;

        const { questionID } = query;

        try {
            const question = await Question.findById(questionID);

            if (question) {
                let results = await Question.aggregate([
                    {
                        $match: {
                            $and: [
                                { _id: { $ne: mongoose.Types.ObjectId(questionID) } },
                                { $text: { $search: question.question } },
                            ],
                        },
                    },
                    { $limit: 10 },
                    { $addFields: { score: { $meta: 'textScore' } } },
                    { $sort: { score: { $meta: 'textScore' } } },
                    {
                        $project: {
                            question: 1,
                        },
                    },
                ]);

                if (results.length < 10) {
                    const topicsMatch = await Question.aggregate([
                        {
                            $match: {
                                $and: [
                                    { topics: { $in: question.topics.map((topic) => mongoose.Types.ObjectId(topic)) } },
                                    {
                                        _id: {
                                            $nin: [
                                                mongoose.Types.ObjectId(questionID),
                                                ...results.map((r) => r._id),
                                            ],
                                        },
                                    },
                                ],
                            },
                        },
                        { $limit: 10 - results.length },
                        {
                            $project: {
                                question: 1,
                            },
                        },
                    ]);

                    results = [
                        ...results,
                        ...topicsMatch,
                    ];
                }
                res
                    .status(200)
                    .json(results);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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

    app.get('/api/v1/question/:questionID', loginMiddleware, queryMiddleware, async(req, res) => {
        try {
            const { questionID } = req.params;
            const {
                pagination,
                custom,
            } = req.queryParams;
            const question = await Question.aggregate([
                { $match: { _id: mongoose.Types.ObjectId(questionID) } },
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
                        from: 'users',
                        localField: 'suggestedExperts',
                        foreignField: '_id',
                        as: 'suggestedExperts',
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
            ]);

            if (question.length) {
                const answers = await Answer.aggregate([
                    { $match: { questionID: mongoose.Types.ObjectId(questionID) } },
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
                        $sort: {
                            upvotersCount: -1,
                            postedDate: -1,
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
                                { $addFields: { upvotersCount: { $size: '$upvoters' } } },
                                {
                                    $sort: {
                                        upvotersCount: -1,
                                        postedDate: -1,
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
                            plainText: 1,
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
                                    $skip: pagination.skip || 0,
                                },
                                {
                                    $limit: pagination.limit || 10,
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
                ]);

                let response = { answers: answers[0] };

                if (!custom._onlyanswers) {
                    response = {
                        ...question[0],
                        ...response,
                    };
                }

                res
                    .status(200)
                    .json(response);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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

    app.put('/api/v1/question/:questionID', loginMiddleware, async(req, res) => {
        try {
            const { xorigin } = req.headers;
            const { questionID } = req.params;
            const {
                description,
                suggestedExperts,
                topics,
                question: questionString,
            } = req.body;

            const question = await Question.findById(questionID);
            const responseObject = { _id: questionID };

            if (question) {
                let edited = false;
                if (suggestedExperts) {
                    question.suggestedExperts = [
                        ...question.suggestedExperts,
                        ...suggestedExperts,
                    ];
                    const experts = await User.find({ _id: { $in: question.suggestedExperts.map((expert) => mongoose.Types.ObjectId(expert)) } });
                    responseObject.suggestedExperts = experts;
                    emailNotify('suggestedExpert', {
                        question: questionString || question.question,
                        _id: questionID,
                        req: req.io,
                        origin: xorigin,
                    }, {
                        author: req.user,
                        suggestedExperts,
                    });
                }

                if (topics) {
                    const chosenTopics = await Topic.find({ _id: { $in: topics.map((topic) => mongoose.Types.ObjectId(topic)) } });
                    question.topics = topics;
                    responseObject.topics = chosenTopics;
                    updateTopicsInAnswers(questionID, topics);
                }

                if (questionString) {
                    question.question = questionString;
                    responseObject.question = questionString;
                    edited = true;
                }

                let newMentions = [];

                if (description || description === '') {
                    updateService(question.description, description);
                    const { plainText, userMentions } = htmlToText(description);
                    const { userMentions: oldUserMentions } = htmlToText(question.description);
                    newMentions = inBButNotInA(oldUserMentions, userMentions);
                    question.description = description;
                    question.plainText = plainText;
                    responseObject.description = description;
                    responseObject.plainText = plainText;
                    edited = true;
                }

                if (edited) {
                    question.lastModified = Date.now();
                    responseObject.lastModified = question.lastModified;
                    emailNotify('editQuestion', {
                        question: questionString || question.question,
                        _id: questionID,
                        req: req.io,
                        origin: xorigin,
                        userMentions: newMentions,
                    }, {
                        author: req.user,
                        suggestedExperts,
                        topics: question.topics,
                    });
                }

                await question.save();
                res
                    .status(200)
                    .json(responseObject);
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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

    app.delete('/api/v1/question/:questionID', loginMiddleware, async(req, res) => {
        try {
            const { questionID } = req.params;
            const question = await Question.findById(questionID);

            if (question) {
                deleteService({
                    type: 'question',
                    htmlContent: question.description,
                });
                await question.remove();
                res
                    .status(200)
                    .json({ questionID });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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

    app.post('/api/v1/question.follow', loginMiddleware, async(req, res) => {
        const {
            questionID,
        } = req.body;

        const {
            _id,
        } = req.user;
        const { xorigin } = req.headers;

        try {
            const question = await Question.findById(questionID);

            if (question) {
                const isFollowing = question.followers.find((follower) => follower.equals(_id));

                if (isFollowing) {
                    question.followers = question.followers.filter((follower) => !follower.equals(_id));
                }
                else {
                    question.followers = [
                        ...question.followers,
                        _id,
                    ];
                }

                await question.save();

                const responseObject = {
                    _id: questionID,
                    follower: req.user,
                    unfollow: Boolean(isFollowing),
                };
                emailNotify('followQuestion', {
                    ...responseObject,
                    req: req.io,
                    origin: xorigin,
                });

                res
                    .status(200)
                    .json({
                        ...responseObject,
                        follower: _id,
                    });
            }
            else {
                res
                    .status(404)
                    .json({
                        error: true,
                        response: QUESTION_NOT_FOUND,
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
