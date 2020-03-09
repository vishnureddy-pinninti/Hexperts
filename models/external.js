const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { Schema } = mongoose;

const externalSchema = new Schema({
    link: {
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
    title: {
        type: String,
        trim: true,
        es_indexed: true,
    },
    content: {
        type: String,
        trim: true,
        es_indexed: true,
    },
});

externalSchema.plugin(mongoosastic, {
    index: 'externals',
    type: '_doc',
});

mongoose.model('externals', externalSchema);
