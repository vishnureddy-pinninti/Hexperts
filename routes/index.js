module.exports = (app) => {
    require('./user')(app);
    require('./question')(app);
    require('./answer')(app);
    require('./uploads')(app);
    require('./topics')(app);
    require('./comments')(app);
    require('./search')(app);
    require('./blogs')(app);
    require('./posts')(app);
    require('./notification')(app);
    require('./contributors')(app);
    require('./crawl')(app);
    require('./dashboard')(app);
};