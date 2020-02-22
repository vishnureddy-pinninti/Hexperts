const mongoose = require('mongoose');
const { Schema } = mongoose;

const { topic } = require('./common');

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
    interests: [ topic ],
    followers: [ mongoose.Types.ObjectId ],
});

mongoose.model('users', userSchema);
