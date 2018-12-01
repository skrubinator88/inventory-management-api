'use strict';
const { client } = require('./Redis');

module.exports = {
    setUsersConnected(users) {
        return new Promise((resolve, reject) => {
            client().then(
                response => {
                    response
                        .multi()
                        .set('users', JSON.stringify(users))
                        .execAsync()
                        .then(
                            res => {
                                if (res[0] === 'OK') {
                                    resolve('Users updated');
                                }
                                reject('Users not updated')
                            },
                            err => {
                                reject(err);
                            }
                        )
                },
                err => {
                    reject('Redis connection failed: ' + err);
                }
            )
        })
    },
    setPropertiesConnected(properties) {
        return new Promise((resolve, reject) => {
            client().then(
                response => {
                    response
                        .multi()
                        .set('properties', JSON.stringify(properties))
                        .execAsync()
                        .then(
                            res => {
                                if (res[0] === 'OK') {
                                    resolve('Properties set');
                                }
                                reject('Properties not set')
                            },
                            err => {
                                reject(err);
                            }
                        )
                },
                err => {
                    reject('Redis connection failed: ' + err);
                }
            )
        })
    },
    setChats(chats) {
        return new Promise((resolve, reject) => {
            client().then(
                response => {
                    response
                        .multi()
                        .set('chats', JSON.stringify(chats))
                        .execAsync()
                        .then(
                            res => {
                                if (res[0] === 'OK') {
                                    resolve('Properties set');
                                }
                                reject('Properties not set')
                            },
                            err => {
                                reject(err);
                            }
                        )
                },
                err => {
                    reject('Redis connection failed: ' + err);
                }
            )
        })
    },
    getChats() {
        return new Promise((resolve, reject) => {
            client().then(
                response => {
                    response
                        .multi()
                        .get("chats")
                        .execAsync()
                        .then(
                        chats => {
                            if(chats[0] !== null) {
                                resolve(JSON.parse(chats))
                            } else {
                                resolve({})
                            }
                        },
                        err => {
                            reject(err);
                        }
                    )
                },
                err => {
                    reject("Redis connection failed: " + err);
                }
            )
        })
    },
};