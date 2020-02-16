const mongoose = require('mongoose');
const { Schema } = mongoose;

const voterSchema = new Schema({
    email: {
        type: String,
    },
    jobTitle: {
        type: String,
    },
    name: {
        type: String,
    },
    userid: {
        type: String,
    },
});

const answerSchema = new Schema({
    answer: {
        type: String,
        required: true,
        trim: true,
    },
    author: voterSchema,
    downvoters: [ voterSchema ],
    lastModified: {
        type: Date,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    questionID: {
        type: String,
        required: true,
    },
    upvoters: [ voterSchema ],
});

mongoose.model('answers', answerSchema);
