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
        expires: 30 * 24 * 60 * 60, // 30 days
    },
    type: {
        type: String,
        trim: true,
    },
    link: {
        type: String,
    },
});

mongoose.model('notifications', notificationSchema);
