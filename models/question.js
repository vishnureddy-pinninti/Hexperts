const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { Schema } = mongoose;

const questionSchema = new Schema({
    author: {
        type: mongoose.Types.ObjectId,
        es_indexed: false,
    },
    followers: {
        type: [ mongoose.Types.ObjectId ],
        es_indexed: false,
    },
    lastModified: {
        type: Date,
        es_indexed: false,
    },
    postedDate: {
        type: Date,
        default: Date.now,
        es_indexed: false,
    },
    suggestedExperts: {
        type: [ mongoose.Types.ObjectId ],
        es_indexed: false,
    },
    topics: {
        type: [ mongoose.Types.ObjectId ],
        es_indexed: false,
    },
    question: {
        type: String,
        trim: true,
        es_indexed: true,
    },
    plainText: {
        type: String,
        trim: true,
        es_indexed: true,
    },
    description: {
        type: String,
        es_indexed: false,
    },
});

questionSchema.index({ question: 'text' });

questionSchema.plugin(mongoosastic, {
    index: 'questions',
    type: '_doc',
});

mongoose.model('questions', questionSchema);
