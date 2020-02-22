const mongoose = require('mongoose');
const { Schema } = mongoose;

const { user } = require('./common');

const commentSchema = new Schema({
    comment: {
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
    target: {
        type: String,
        default: 'answer',
    },
    targetID: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    upvoters: [ user ],
});

mongoose.model('comments', commentSchema);
