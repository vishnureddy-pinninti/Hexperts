const mongoose = require('mongoose');

const { Schema } = mongoose;
const answerSchema = require('./answer');

const questionSchema = new Schema({
    answers: [ answerSchema ],
    author: {
        type: String,
    },
    followers: [ String ],
    lastModified: {
        type: Date,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    suggestedExperts: [ String ],
    tags: [ String ],
    question: {
        type: String,
        trim: true,
    },
});

mongoose.model('questions', questionSchema);
