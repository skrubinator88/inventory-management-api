const { createMessage, createEntity } = require('../Factories/SocketFactories');
const { createNotification } = require('../Factories/ApnFactories');
const { MESSAGE_DELIVERED, CHAT_DELETED } = require('./chatEvents');
const client = require('../config/Redis');
const apnProvider = require('../config/apnManager');
const { PROPERTY, USER } = require('./chatEntities');

function isUser(token) {
    jwt.verify(token, config.jwt_secret, function(err, decoded) {
        if(err) {
            console.log(err);
            return false;
        }
        if(decoded) {
            console.log('token verified');
            return true;
        }
    })
}

function addConnection(socket, entity) {
    if(entity && socket) {
        if(!entity.sockets.includes(socket.id)) {
            entity.sockets.push(socket.id);
        }
        return entity
    } else {
        let newEntity = createEntity({name: entity.name, id: entity.id, sockets: [], email: entity.email, chats: []});
        if(socket) {
            console.log(newEntity);
            newEntity.sockets.push(socket.id);
        }
        return newEntity
    }
}

function removeConnection(user, socketId) {
    if(user.sockets.includes(socketId)) {
        for( let i = 0; i < user.sockets.length; i++){
            if ( user.sockets[i] === socketId) {
                user.sockets.splice(i, 1);
            }
        }
    }
    // newList[id].socketId = null;
    return user;
}

async function deleteChat(chatId, socket) {
    try {
        let chat = await client.getKeyValue('chats', chatId);
        let user = await client.getKeyValue('users', chat.users[2]);
        let property = await client.getKeyValue('properties', chat.users[3]);
        console.log(property.chats);
        console.log(user.chats,"\n");
        for( let i = 0; i < user.chats.length; i++){
            if ( user.chats[i] === chatId) {
                user.chats.splice(i, 1);
            }
        }
        for( let i = 0; i < property.chats.length; i++){
            if ( property.chats[i] === chatId) {
                property.chats.splice(i, 1);
            }
        }
        await property.sockets.map(async socketId => {
            await socket.to(socketId).emit(CHAT_DELETED, chatId);
        });
        await user.sockets.map(async socketId => {
            await socket.to(socketId).emit(CHAT_DELETED, chatId);
        });
        await socket.emit(CHAT_DELETED, chatId);
        await client.setKeyValue('properties', chat.users[3], property);
        await client.setKeyValue('users', chat.users[2], user);
        await client.deleteKeyValue('chats', chatId);
    } catch (err) {
        throw err
    }
}

function sendMessageToChat(sender, socket) {
    return async (chatId, message, opened, id)=>{
        client.getKeyValue('chats', chatId).then(chat => {
            let newMessage = createMessage({message, sender, opened, id, chatId});
            newMessage.propertyName = chat.users[1];
            chat.messages.push(newMessage);
            client.setKeyValue('chats', chatId, chat).then(async ()=> {
                try {
                    let user = await client.getKeyValue('users', chat.users[2]);
                    let property = await client.getKeyValue('properties', chat.users[3]);
                    await user.sockets.map(socketId => {
                        socket.to(socketId).emit(MESSAGE_DELIVERED, newMessage);
                    });
                    await property.sockets.map(socketId => {
                        socket.to(socketId).emit(MESSAGE_DELIVERED, newMessage);
                    });
                    socket.emit(MESSAGE_DELIVERED, newMessage);
                    if(sender === property.id) {
                        user.badge++;
                        let notification = createNotification({alert: `${property.name} has sent you a message`, badge: user.badge, sound: 'ping.aiff'});
                        console.log("Notification: ", notification);
                        apnProvider.sendNotification(user.deviceToken, notification, function(err, info) {
                            if(err)
                                throw err;
                            console.log(info.failed, "response: ", info.failed[0].response);
                        });
                        await client.setKeyValue('users', user.id, user);
                    }
                } catch (err) {
                    throw err
                }
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
        });
    }
}

module.exports = {
    isUser,
    addConnection,
    removeConnection,
    sendMessageToChat,
    deleteChat
};