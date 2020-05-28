const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { Schema } = mongoose;

const postSchema = new Schema({
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
    // blog: {
    //     type: mongoose.Types.ObjectId,
    //     es_indexed: false,
    // },
    topics: {
        type: [ mongoose.Types.ObjectId ],
        es_indexed: false,
    },
    title: {
        type: String,
        trim: true,
        es_indexed: true,
    },
    description: {
        type: String,
        es_indexed: false,
    },
    plainText: {
        type: String,
        trim: true,
        es_indexed: true,
    },
    upvoters: {
        type: [ mongoose.Types.ObjectId ],
        es_indexed: false,
    },
    topicsAsString: {
        type: String,
        trim: true,
        es_indexed: true,
    },
});

postSchema.plugin(mongoosastic, {
    index: 'posts',
    type: '_doc',
});

mongoose.model('posts', postSchema);
