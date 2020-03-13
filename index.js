require('./models/db');
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const http = require('http');

const httpx = require('./httpx');

const app = express();
const { PORT } = require('./utils/constants');

let server;
let mode = 'DEV';

if (process.env.NODE_ENV === 'production') {
    const ensureSecure = (req, res, next) => {
        if (req.secure) {
            return next();
        }
        return res.redirect(`https://${req.hostname}:${PORT}${req.url}`);
    };

    mode = 'PROD';
    const options = {
        cert: fs.readFileSync('./certs/wildcard_intergraph_com2018.crt'),
        ca: fs.readFileSync('./certs/DigiCertCA.crt'),
        key: fs.readFileSync('./certs/wildcard_intergraph_com2018.key'),
    };
    server = httpx.createServer(options, app);

    app.all('*', ensureSecure);
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

server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Running in PROD ${mode}. Listening on port ${PORT}`);
});
