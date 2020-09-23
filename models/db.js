/* eslint-disable no-console */
const mongoose = require('mongoose');
const keys = require('../config/keys');

const connectWithRetry = () => {
    return mongoose.connect(keys.dbURL, (err) => {
        if (err) {
            console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
            setTimeout(connectWithRetry, 5000);
        }
        else {
            console.log('Mongoose connected to ', keys.dbURL);
        }
    });
};

connectWithRetry();

require('./answer');
require('./question');
require('./user');
require('./comment');
require('./topic');
require('./blog');
require('./post');
require('./notification');
require('./external');
require('./feedback');
require('./draft');