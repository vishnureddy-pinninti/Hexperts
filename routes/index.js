module.exports = (app) => {
    require('./user')(app);
    require('./question')(app);
    require('./answer')(app);
    require('./uploads')(app);
    require('./topics')(app);
    require('./comments')(app);
    require('./search')(app);
    require('./space')(app);
    require('./blogs')(app);
    require('./notification')(app);
};