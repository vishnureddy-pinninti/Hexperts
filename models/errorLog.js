const mongoose = require('mongoose');
const { Schema } = mongoose;

const errorLogSchema = new Schema({
    author: {
        type: mongoose.Types.ObjectId,
    },
    createdDate: {
        type: Date,
        default: Date.now,
    },
    name: {
        type: String,
        trim: true,
    },
    errorMessage: {
        type: String,
        trim: true,
    },
    errorCode: {
        type: String,
        trim: true,
    },
});

mongoose.model('errorLogs', errorLogSchema);
