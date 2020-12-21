const mongoose = require('mongoose');
const { Schema } = mongoose;

const feedbackSchema = new Schema({
    author: {
        type: mongoose.Types.ObjectId,
    },
    lastModified: {
        type: Date,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    subject: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
    },
    isAddressed: {
        type: Boolean,
        default: false,
    },
});

mongoose.model('feedbacks', feedbackSchema);
