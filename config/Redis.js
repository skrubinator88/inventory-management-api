const redis = require('redis');
const promise = require('bluebird');
const env = process.env.NODE_ENV || 'development';
const config = require('./config_env')[env];

promise.promisifyAll(redis.RedisClient.prototype);
let client = null;
module.exports = {
    initRedisClient() {
        client = redis.createClient(config.redisStore.port,config.redisStore.host);
        console.debug("Initalizing Redis Client");
        client.on('ready',function() {
            console.debug(" subs Redis is ready");
        });

        client.on('connect',function(){
            console.debug('subs connected to redis');
        });
    },
    getKeyValue(key) {
        return new Promise((resolve, reject) => {
            client.getAsync(key)
                .then((res, err) => {
                    if(err)
                        reject("An error occurred "+err);
                    if(res){
                        resolve(JSON.parse(res));
                    }
                    resolve({})
                })
        })
    },
    setKeyValue(key, value) {
        return new Promise((resolve, reject) => {
            value = JSON.stringify(value);
            client.setAsync(key, value)
                .then((res, err) => err ? reject(`set${key} : `+err) : resolve(res))
        })
    }
};