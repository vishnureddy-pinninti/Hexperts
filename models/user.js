const mongoose = require('mongoose');
const mongoosastic = require('mongoosastic');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        es_indexed: true,
    },
    email: {
        type: String,
        es_indexed: true,
    },
    jobTitle: {
        type: String,
        es_indexed: false,
    },
    userid: {
        type: String,
        es_indexed: false,
    },
    city: {
        type: String,
        es_indexed: false,
    },
    companyName: {
        type: String,
        es_indexed: false,
    },
    country: {
        type: String,
        es_indexed: false,
    },
    department: {
        type: String,
        es_indexed: false,
    },
    employeeId: {
        type: String,
        es_indexed: false,
    },
    officeLocation: {
        type: String,
        es_indexed: false,
    },
    postalCode: {
        type: String,
        es_indexed: false,
    },
    state: {
        type: String,
        es_indexed: false,
    },
    streetAddress: {
        type: String,
        es_indexed: false,
    },
    businessPhones: {
        type: [ String ],
        es_indexed: false,
    },
    mobilePhone: {
        type: String,
        es_indexed: false,
    },
    interests: {
        type: [ mongoose.Types.ObjectId ],
        es_indexed: false,
    },
    expertIn: {
        type: [ mongoose.Types.ObjectId ],
        es_indexed: false,
    },
    blogs: {
        type: [ mongoose.Types.ObjectId ],
        es_indexed: false,
    },
    followers: {
        type: [ mongoose.Types.ObjectId ],
        es_indexed: false,
    },
    emailSubscription: {
        type: Boolean,
        default: false,
        es_indexed: false,
    },
    emailPreferences: {
        type: [ String ],
        es_indexed: false,
    },
    reputation: {
        type: Number,
        default: 0,
        es_indexed: true,
    },
    role: {
        type: String,
        default: 'user',
        es_indexed: false,
    },
    upvotes: {
        type: Number,
        default: 0,
        es_indexed: false,
    },
    confluenceAuthentication: {
        type: String,
        es_indexed: false,
    },
    isConfluenceEnabled: {
        type: Boolean,
        es_indexed: false,
    },
});

userSchema.plugin(mongoosastic, {
    index: 'users',
    type: '_doc',
});

mongoose.model('users', userSchema);
