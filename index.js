require('./models/db');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const https = require('https');

const app = express();
const { PORT } = require('./config/keys');
const options = require('./cert');

let server;
const env = process.env.NODE_ENV;

const ensureSecure = (req, res, next) => {
    if (req.secure) {
        return next();
    }
    const redirectUrl = env === 'production' ? `https://${req.hostname}${req.url}`: `https://${req.hostname}:${PORT}${req.url}`;
    return res.redirect(redirectUrl);
};

// if (env === 'qa') {
//     app.all('*', ensureSecure);
//     server = httpolyglot.createServer(options, app);
// }
if (env === 'production') {
    app.all('*', ensureSecure);
    server = https.createServer(options, app);
}
else {
    server = http.createServer(app);
}

app.use(cookieParser());

app.use(bodyParser.json({ limit: '10mb' }));

const io = require('socket.io')(server);
app.use((req, res, next) => {
    req.io = io;
    next();
});

require('./routes/index')(app);

app.use(express.static('client/build'));
app.use('/api/v1/images', express.static('uploads/img'));
// serve the index.html if does not recognize any route
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

if (env === 'production') {
    http.createServer(app).listen(80);
    server.listen(443, () => {
        // eslint-disable-next-line no-console
        console.log(`Running in PROD mode. Listening on port 443`);
    });
}
else {
    server.listen(PORT, () => {
        // eslint-disable-next-line no-console
        console.log(`Running in ${env} mode. Listening on port ${PORT}`);
    });
}
