'use strict'

const redis = require("redis");
const redisClient = redis.createClient();
const { promisify } = require("util");
const { reservationInventory } = require("../models/repository/inventory.repo");

const pExpire = promisify(redisClient.PEXPIRE).bind(redisClient);
const setNX = promisify(redisClient.SETNX).bind(redisClient);

const acquireLock = async ({ productId, cartId, quantity }) => {
    const key = `lock_2024_${productId}`;
    const retryTime = 10;
    const expireTime = 3000;

    for (let i = 0; i < retryTime; i++) {
        //  generate a new optimistic key for possession who has fully controlled CRUD 
        const result = await setNX(key, expireTime);
        console.log("Result=====", result);

        if (result === 1) {
            const isReservation = await reservationInventory({ productId, quantity, cartId });
            if (isReservation.modifiedCount) {
                await pExpire(key, expireTime);
                return key;
            }
            //  privilege to add update_key
            return null;
        } else {
            //  try until get key success
            await new Promise((resolve) => setTimeout(resolve, 50))
        }
    }
}

const releaseLock = async (keyLock) => {
    const deleteLockAsync = promisify(redisClient.del).bind(redisClient);
    return await deleteLockAsync(keyLock)
}

module.exports = { releaseLock, acquireLock }