const mongoose = require('mongoose');
const User = mongoose.model('users');
const Question = mongoose.model('questions');

const getUserFollowers = async(id) => {
    const userFollowers = await User.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(id) } },
        { $unwind: '$followers' },
        {
            $lookup: {
                from: 'users',
                localField: 'followers',
                foreignField: '_id',
                as: 'followers',
            },
        },
        { $unwind: '$followers' },
        {
            $group: {
                _id: '$_id',
                followers: { $push: '$followers' },
            },
        },
    ]);

    const uFollowers = userFollowers.length > 0 ? userFollowers[0] : { followers: [] };
    return uFollowers.followers.map((follower) => `${follower.name} <${follower.email}>`);
};

const getTopicFollowers = async(topics) => {
    const topicFollowers = await User.find({ 'interests': { $in: topics.map((topic) => mongoose.Types.ObjectId(topic)) } });
    return topicFollowers.map((follower) => `${follower.name} <${follower.email}>`);
};

const getSuggestedExperts = async(suggestedExperts) => {
    const experts = await User.find({ _id: { $in: suggestedExperts.map((expert) => mongoose.Types.ObjectId(expert)) } });
    return experts.map((expert) => `${expert.name} <${expert.email}>`);
};

const getQuestionFollowers = async(questionID, onlyAuthor = false) => {
    if (onlyAuthor) {
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
            { $unwind: '$author' },
        ]);
        return `${question[0].author.name} <${question[0].author.email}>`;
    }
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
        { $unwind: '$author' },
        {
            $lookup: {
                from: 'users',
                localField: 'followers',
                foreignField: '_id',
                as: 'followers',
            },
        },
    ]);

    return [
        ...question[0].followers.map((follower) => `${follower.name} <${follower.email}>`),
        `${question[0].author.name} <${question[0].author.email}>`,
    ];
};

const getAuthor = async(id, model) => {
    const records = await model.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(id) } },
        {
            $lookup: {
                from: 'users',
                localField: 'author',
                foreignField: '_id',
                as: 'author',
            },
        },
        { $unwind: '$author' },
    ]);
    return `${records[0].author.name} <${records[0].author.email}>`;
};

module.exports = {
    getUserFollowers,
    getTopicFollowers,
    getSuggestedExperts,
    getQuestionFollowers,
    getAuthor,
};