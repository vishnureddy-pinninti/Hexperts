const mongoose = require('mongoose');
const { Schema } = mongoose;

const { user } = require('./common');

const topicSchema = new Schema({
    topic: {
        type: String,
        required: true,
        trim: true,
    },
    followers: [ user ],
    lastModified: {
        type: Date,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
});

topicSchema.index({ topic: 'text' });

mongoose.model('topics', topicSchema);
