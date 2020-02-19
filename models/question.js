const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    jobTitle: {
        type: String,
    },
    userid: {
        type: String,
    },
});

const questionSchema = new Schema({
    author: userSchema,
    followers: [ userSchema ],
    lastModified: {
        type: Date,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    suggestedExperts: [ userSchema ],
    tags: [ String ],
    question: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
    },
});

mongoose.model('questions', questionSchema);
