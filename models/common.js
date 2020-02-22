const mongoose = require('mongoose');

const { Schema } = mongoose;

const user = new Schema({
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

const topic = new Schema({
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

module.exports = {
    user,
    topic,
};
