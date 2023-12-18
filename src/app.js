const express = require("express");
const app = express();
const morgan = require("morgan")
const helmet = require("helmet")
const compression = require("compression");
const { countConnect, checkOverLoad } = require("./helpers/check.connect")
const router = require("./router/index")
const bodyParser = require("body-parser")

// init middlewares
app.use(morgan('dev'))
app.use(helmet()) //prevent data leaked from the third-party access.
app.use(compression())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json()) //or express.json()

// init db
require('./dbs/init.mongodb')
countConnect()

// init routes
app.use('/', router)

// handling err
app.use((req, res, next) => {
    const err = new Error('Not Found'); //error message
    err.status = 404; //error status
    next(err) // send err data to another middleware handling
})

app.use((err, req, res, next) => {
    const status = err.status || 500
    return res.status(status).json({
        status: 'error',
        code: status,
        stack: err.stack,
        message: err.message || "Internal server error"
    })
})

module.exports = app