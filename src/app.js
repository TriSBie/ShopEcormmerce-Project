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
/* app.use(morgan('combined'))
 app.use(morgan('common'))
 app.use(morgan('short'))
 app.use(morgan('ti'))
*/

// init db
require('./dbs/init.mongodb')
countConnect()
//optional checkConnection()


// init routes
app.use('/', router)

// app.get('/', (req, res, next) => {

//     return res.status(200).json({
//         message: 'Welcome!',
//         // metadata: strCompress.repeat(1000)
//     })
// })

// handling err
module.exports = app