const Arena = require('bull-arena');
const morgan = require('morgan');
const express = require('express');
const queues = require('./queues').queues;

const app = express()
const port = process.env.PORT || 3000

app.use('/bull', Arena(
    {
        queues
    },
    {
        basePath: '/arena',
        disableListen: true
    }
));

app.use(morgan("combined"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`))