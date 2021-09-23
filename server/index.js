const express = require('express');
const morgan = require('morgan');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('combined'));

app.get('/', function (req, res) {
    res.send('hello, world!')
});

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
});