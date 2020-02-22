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
});

topicSchema.index({ topic: 'text' });

mongoose.model('topics', topicSchema);
