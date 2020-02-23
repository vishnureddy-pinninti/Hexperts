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
    interests: [ mongoose.Types.ObjectId ],
    followers: [ mongoose.Types.ObjectId ],
    emailSubscription: {
        type: Boolean,
        default: true,
    },
});

mongoose.model('users', userSchema);
