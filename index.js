require('./models/db');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const httpx = require('./httpx');

const app = express();
const { PORT } = require('./utils/constants');

const ensureSecure = (req, res, next) => {
    if (req.secure) {
        return next();
    }
    res.redirect(`https://${req.hostname}:${PORT}${req.url}`);
    return null;
};

app.all('*', ensureSecure);

app.use(cookieParser());

app.use(bodyParser.json());

require('./routes/index')(app);

app.use(express.static('client/build'));
app.use('/api/v1/images', express.static('uploads/img'));
// serve the index.html if does not recognize any route
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});


const options = {
    cert: fs.readFileSync('./certs/wildcard_intergraph_com2018.crt'),
    ca: fs.readFileSync('./certs/DigiCertCA.crt'),
    key: fs.readFileSync('./certs/wildcard_intergraph_com2018.key'),
};

const server = httpx.createServer(options, app);

server.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${PORT}`);
});
