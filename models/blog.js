const mongoose = require('mongoose');
const { Schema } = mongoose;

const blogSchema = new Schema({
    author: mongoose.Types.ObjectId,
    downvoters: [ mongoose.Types.ObjectId ],
    lastModified: {
        type: Date,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    space: mongoose.Types.ObjectId,
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
    },
    upvoters: [ mongoose.Types.ObjectId ],
});

blogSchema.index({
    title: 'text',
    description: 'text',
});

mongoose.model('blogs', blogSchema);
