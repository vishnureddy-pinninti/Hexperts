const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { Schema } = mongoose;

const blogSchema = new Schema({
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
    postedDate: {
        type: Date,
        default: Date.now,
        es_indexed: false,
    },
    space: {
        type: mongoose.Types.ObjectId,
        es_indexed: false,
    },
    title: {
        type: String,
        trim: true,
        es_indexed: true,
    },
    description: {
        type: String,
        es_indexed: true,
    },
    upvoters: {
        type: [ mongoose.Types.ObjectId ],
        es_indexed: false,
    },
});

blogSchema.plugin(mongoosastic, {
    index: 'blogs',
    type: '_doc',
});

mongoose.model('blogs', blogSchema);
