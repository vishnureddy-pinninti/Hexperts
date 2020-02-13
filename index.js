require('./models/db');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').createServer(app);
const { PORT } = require('./utils/constants');

app.use(bodyParser.json());

require('./routes/question')(app);
require('./routes/answer')(app);

app.use(express.static('client/build'));
// serve the index.html if does not recognize any route
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

http.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${PORT}`);
});
