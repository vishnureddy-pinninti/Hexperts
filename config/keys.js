const prod = require('./prod');
const dev = require('./dev');
const qa = require('./qa');
const env = process.env.NODE_ENV;

if (env === 'production'){
    module.exports = prod;
}
else if (env === 'qa') {
    module.exports = qa;
}
else {
    module.exports = dev;
}
