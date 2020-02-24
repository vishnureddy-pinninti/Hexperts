const mongoose = require('mongoose');
const { Schema } = mongoose;

const topicSchema = new Schema({
    topic: {
        type: String,
        required: true,
        trim: true,
    },
    lastModified: {
        type: Date,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    imageUrl: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
});

topicSchema.index({ topic: 'text' });

mongoose.model('topics', topicSchema);
