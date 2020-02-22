const mongoose = require('mongoose');
const { Schema } = mongoose;

const { user } = require('./common');

const answerSchema = new Schema({
    answer: {
        type: String,
        required: true,
        trim: true,
    },
    author: user,
    downvoters: [ user ],
    lastModified: {
        type: Date,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    questionID: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    upvoters: [ user ],
});

mongoose.model('answers', answerSchema);
