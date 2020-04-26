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
    return uFollowers.followers;
};

const getTopicFollowers = async(topics = []) => await User.find({ 'interests': { $in: topics.map((topic) => mongoose.Types.ObjectId(topic)) } });

const getSuggestedExperts = async(suggestedExperts = []) => await User.find({ _id: { $in: suggestedExperts.map((expert) => mongoose.Types.ObjectId(expert)) } });

const getQuestionFollowers = async(questionID) => {
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

    if (question.length) {
        return [
            ...question[0].followers,
            question[0].author,
        ];
    }

    return [];
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
    return records[0].author;
};

const getBlogFollowers = async(blog) => await User.find({ 'blogs': mongoose.Types.ObjectId(blog) });

const emailPreferenceTypes = [
    'newQuestion',
    'newAnswer',
    'followQuestion',
    'upvoteAnswer',
    'newComment',
    'newPost',
    'upvotePost',
    'followUser',
    'suggestedExpert',
    'editQuestion',
    'editAnswer',
    'editPost',
];

module.exports = {
    getUserFollowers,
    getTopicFollowers,
    getSuggestedExperts,
    getQuestionFollowers,
    getAuthor,
    getBlogFollowers,
    emailPreferenceTypes,
};