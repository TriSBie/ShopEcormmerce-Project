'use strict'

const mongoose = require("mongoose")
const strConnection = `mongodb+srv://buiductri2002:tri2072002@cluster0.obvzh1x.mongodb.net/?retryWrites=true&w=majority`

const { countConnect } = require("../helpers/check.connect")


class Database { //create single Class with Singeleton Pattern
    constructor() {
        this.connect()
    }

    connect(type = 'mongodb') {
        if (1 === 1) { //dev
            mongoose.set('debug', true)
            mongoose.set('debug', { color: true })
        }
        mongoose
            .connect(strConnection, {
                maxPoolSize: 50 // by default : 100
            })
            .then(_ => console.log(`Connected MongoDB success`))
            .catch(err => console.log(`Error connection !`, err))
    }

    // SINGLETON PATTERN
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
}

const instanceMongodb = Database.getInstance();

module.exports = instanceMongodb