const mongoose = require('mongoose');

const { Schema } = mongoose;
const answerSchema = require('./answer');

const questionSchema = new Schema({
    author: {
        type: String,
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
    answers: [ answerSchema ],
});

mongoose.model('questions', questionSchema);
