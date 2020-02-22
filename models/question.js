const mongoose = require('mongoose');
const { Schema } = mongoose;

const { user, topic } = require('./common');

const questionSchema = new Schema({
    author: user,
    followers: [ user ],
    lastModified: {
        type: Date,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    suggestedExperts: [ user ],
    topics: [ topic ],
    question: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
    },
});

questionSchema.index({ question: 'text' });

mongoose.model('questions', questionSchema);
