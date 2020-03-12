const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { Schema } = mongoose;

const blogSchema = new Schema({
    author: {
        type: mongoose.Types.ObjectId,
        es_indexed: false,
    },
    name: {
        type: String,
        required: true,
        trim: true,
        es_indexed: true,
    },
    lastModified: {
        type: Date,
        es_indexed: false,
    },
    createdDate: {
        type: Date,
        default: Date.now,
        es_indexed: false,
    },
    imageUrl: {
        type: String,
        trim: true,
        es_indexed: true,
    },
    description: {
        type: String,
        trim: true,
        es_indexed: false,
    },
    plainText: {
        type: String,
        trim: true,
        es_indexed: true,
    },
});

blogSchema.plugin(mongoosastic, {
    index: 'blogs',
    type: '_doc',
});

mongoose.model('blogs', blogSchema);
