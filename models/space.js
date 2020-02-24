const mongoose = require('mongoose');
const { Schema } = mongoose;

const spaceSchema = new Schema({
    author: {
        type: mongoose.Types.ObjectId,
    },
    name: {
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

spaceSchema.index({ name: 'text' });

mongoose.model('spaces', spaceSchema);
