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

const commentSchema = new Schema({
    comment: {
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
    target: {
        type: String,
        default: 'answer',
    },
    targetID: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    upvoters: [ voterSchema ],
});

mongoose.model('comments', commentSchema);
