const mongoose = require('mongoose');
const { Schema } = mongoose;

const draftSchema = new Schema({
    author: {
        type: mongoose.Types.ObjectId,
    },
    lastModified: {
        type: Date,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    topics: {
        type: [ mongoose.Types.ObjectId ],
    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
    },
    plainText: {
        type: String,
        trim: true,
    },
});

mongoose.model('drafts', draftSchema);
