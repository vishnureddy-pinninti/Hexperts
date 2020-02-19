require('./models/db');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const http = require('http').createServer(app);
const { PORT } = require('./utils/constants');

app.use(cookieParser());

app.use(bodyParser.json());

require('./routes/auth')(app);
require('./routes/question')(app);
require('./routes/answer')(app);
require('./routes/uploads')(app);
require('./routes/tags')(app);
require('./routes/comments')(app);

app.use(express.static('client/build'));
app.use('/api/v1/images', express.static('uploads/img'));
// serve the index.html if does not recognize any route
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

http.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${PORT}`);
});
