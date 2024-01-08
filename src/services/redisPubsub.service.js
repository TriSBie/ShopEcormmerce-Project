'use strict'

const redis = require("redis");

class RedisPubSubService {
    constructor() {
        this.subcriber = redis.createClient();
        this.publisher = redis.createClient();
    }

    async publish(channel, message) {
        return await this.redisClient.publish(channel, message);
    }

    async subscribe(channel) {
        return await this.redisClient.subscribe(channel);
    }
}