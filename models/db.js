/* eslint-disable no-console */
const mongoose = require('mongoose');
const keys = require('../config/keys');

mongoose.connect(keys.dbURL);

mongoose.connection.on('connected', () => {
    console.log('Mongoose connected to ', keys.dbURL);
});

mongoose.connection.on('disconnected', () => {
    console.log('Mongoose disconnected');
});

mongoose.connection.on('error', (err) => {
    console.log('Error connecting to db ', err);
});

require('./answer');
require('./question');
require('./user');
require('./comment');
require('./topic');
require('./space');
require('./blog');
require('./notification');