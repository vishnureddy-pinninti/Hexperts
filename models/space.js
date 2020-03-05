const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { Schema } = mongoose;

const spaceSchema = new Schema({
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
        es_indexed: false,
    },
    description: {
        type: String,
        trim: true,
        es_indexed: true,
    },
});

spaceSchema.plugin(mongoosastic, {
    index: 'spaces',
    type: '_doc',
});

mongoose.model('spaces', spaceSchema);
