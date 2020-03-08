const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { Schema } = mongoose;

const topicSchema = new Schema({
    topic: {
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
        es_indexed: true,
    },
});

topicSchema.plugin(mongoosastic, {
    index: 'topics',
    type: '_doc',
});

mongoose.model('topics', topicSchema);
