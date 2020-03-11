const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { Schema } = mongoose;

const answerSchema = new Schema({
    answer: {
        type: String,
        required: true,
        trim: true,
        es_indexed: false,
    },
    author: {
        type: mongoose.Types.ObjectId,
        es_indexed: false,
    },
    downvoters: {
        type: [ mongoose.Types.ObjectId ],
        es_indexed: false,
    },
    lastModified: {
        type: Date,
        es_indexed: false,
    },
    plainText: {
        type: String,
        trim: true,
        es_indexed: true,
    },
    postedDate: {
        type: Date,
        default: Date.now,
        es_indexed: false,
    },
    questionID: {
        type: mongoose.Types.ObjectId,
        required: true,
        es_indexed: true,
    },
    upvoters: {
        type: [ mongoose.Types.ObjectId ],
        es_indexed: false,
    },
});

answerSchema.plugin(mongoosastic, {
    index: 'answers',
    type: '_doc',
});

mongoose.model('answers', answerSchema);
