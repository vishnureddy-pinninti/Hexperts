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
        unique: true,
    },
});

mongoose.model('users', userSchema);
