const mongoose = require('mongoose');
const { Schema } = mongoose;

const answerSchema = new Schema({
    answer: {
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
    questionID: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    upvoters: [ mongoose.Types.ObjectId ],
});

mongoose.model('answers', answerSchema);
