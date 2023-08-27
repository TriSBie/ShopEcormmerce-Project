'use strict'

const os = require("os")
const mongoose = require("mongoose")
const strConnection = 'mongodb+srv://buiductri2002:tri2072002@cluster0.obvzh1x.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(strConnection).then(_ => console.log(`Connected MongoDB success`))
    .catch(err => console.log(`Error connection !`))

if (1 === 0) {
    mongoose.set('debug', true)
    mongoose.set('debug', { color: true })
}

module.exports = mongoose

