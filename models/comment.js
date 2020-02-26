const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
    comment: {
        type: String,
        required: true,
        trim: true,
    },
    author: mongoose.Types.ObjectId,
    downvoters: [ mongoose.Types.ObjectId ],
    lastModified: {
        type: Date,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    target: {
        type: String,
        default: 'answers',
    },
    targetID: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    upvoters: [ mongoose.Types.ObjectId ],
});

mongoose.model('comments', commentSchema);
