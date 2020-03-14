const mongoose = require('mongoose');
const { Schema } = mongoose;

const recipientSchema = new Schema({
    user: mongoose.Types.ObjectId,
    read: {
        type: Boolean,
        default: false,
    },
});

const notificationSchema = new Schema({
    recipients: [ recipientSchema ],
    message: {
        type: String,
        trim: true,
    },
    postedDate: {
        type: Date,
        default: Date.now,
    },
    link: {
        type: String,
    },
});

mongoose.model('notifications', notificationSchema);
