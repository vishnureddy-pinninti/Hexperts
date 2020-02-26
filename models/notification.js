const mongoose = require('mongoose');
const { Schema } = mongoose;

const notificationSchema = new Schema({
    recipient: mongoose.Types.ObjectId,
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
    read: {
        type: Boolean,
        default: false,
    },
    lastModified: {
        type: Date,
    },
});

mongoose.model('notifications', notificationSchema);
