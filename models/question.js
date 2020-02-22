const mongoose = require('mongoose');
const { Schema } = mongoose;

const questionSchema = new Schema({
    author: mongoose.Types.ObjectId,
    followers: [ mongoose.Types.ObjectId ],
    lastModified: {
        type: Date,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    suggestedExperts: [ mongoose.Types.ObjectId ],
    topics: [ mongoose.Types.ObjectId ],
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
