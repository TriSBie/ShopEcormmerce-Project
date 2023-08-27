'use strict'

const mongoose = require("mongoose");
const os = require('os')

const _SECONDS = 5000


//check connection counter
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log(`Number of connection: ${numConnection}`)
    // const statusConnection = mongoose.connections.con
}

//check overload
const checkOverLoad = () => {
    setInterval(() => {
        const numberConnection = mongoose.connections.length
        const numCores = os.cpus().length
        const memoryUsed = process.memoryUsage().rss

        //suppose the maximum of connection mongoDB based on the osf cores
        const maxConnection = numCores * 5 //5 cores * 5 = 35 available connection

        console.log(memoryUsed / 1024 / 1024, `MB`);
        if (numberConnection > maxConnection) {
            console.log('Connection Overload detected !');
        }
    }, _SECONDS)
}
module.exports = { countConnect, checkOverLoad }
