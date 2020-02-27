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
    expertIn: [ mongoose.Types.ObjectId ],
    spaces: [ mongoose.Types.ObjectId ],
    followers: [ mongoose.Types.ObjectId ],
    emailSubscription: {
        type: Boolean,
        default: true,
    },
    reputation: {
        type: Number,
        default: 0,
    },
});

mongoose.model('users', userSchema);
