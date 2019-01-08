const redis = require('redis');
const promise = require('bluebird');
const env = process.env.NODE_ENV || 'development';
const config = require('./config_env')[env];

promise.promisifyAll(redis.RedisClient.prototype);
let client = null;
module.exports = {
    initRedisClient() {
        client = redis.createClient(config.redisStore);
        console.debug("Initalizing Redis Client");
        client.on('ready',function() {
            console.debug(" subs Redis is ready");
        });

        client.on('connect',function(){
            console.debug('subs connected to redis');
        });
    },
    getKeyValue(key, subKey) {
        return new Promise(async (resolve, reject) => {
            try {
                let object = await client.hgetAsync(key,subKey);
                if(object)
                    object = JSON.parse(object);
                resolve(object);
            } catch (err) {
                reject(err)
            }
        })
    },
    setKeyValue(key, subKey, value) {
        return new Promise(async (resolve, reject) => {
            try {
                value = JSON.stringify(value);
                let response = await client.hsetAsync(key, subKey, value);
                resolve(response);
            } catch (err) {
                reject(err);
            }
        })
    },
    deleteKeyValue(key, subKey) {
        return new Promise((resolve, reject) => {
            client.hdelAsync(key, subKey)
                .then((res, err) => err ? reject(`set${key} : `+err) : resolve({}))
        })
    }
};