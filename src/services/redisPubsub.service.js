'use strict'

const redis = require("redis");
const client = redis.createClient({
    password: 'QdRhJqEKhcgLlhXSKfqzrmylb1VcNl9H',
    socket: {
        host: 'redis-17071.c326.us-east-1-3.ec2.cloud.redislabs.com',
        port: 17071
    }
});

class RedisPubSubService {
    constructor() {
        this.subcriber = client.connect();
        this.publisher = client.duplicate().connect();
    }

    async publish(channel, message) {
        console.log("Publish======", channel, message)
        return (await this.publisher).publish(channel, message);
    }

    async subscribe(channel, callback) {
        console.log("subcribe=====", channel, callback);
        (await this.subcriber).subscribe(channel, message => {
            callback(message)
        });
    }
}

module.exports = new RedisPubSubService();