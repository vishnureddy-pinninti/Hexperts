const mongoose = require('mongoose');

const { Schema } = mongoose;

const answerSchema = new Schema({
    author: {
        type: String,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    answer: {
        type: String,
        required: true,
        trim: true,
    },
});

module.exports = answerSchema;
