const { createMessage, createEntity } = require('../Factories/SocketFactories');
const { createNotification, createNotificationObject } = require('../Factories/ApnFactories');
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
        // if(!entity.sockets.includes(socket.id)) {
        //     entity.sockets.push(socket.id);
        // }
        socket.join(`${entity.id}`);
        return entity
    } else {
        let newEntity = createEntity({name: entity.name, id: entity.id, sockets: [], email: entity.email, chats: [], notifications: []});
        if(socket) {
            console.log(newEntity);
            // newEntity.sockets.push(socket.id);
            socket.join(`${newEntity.id}`);
        }
        return newEntity
    }
}

function removeConnection(user, socketId) {
    return user;
}
function deleteItem(item, array) {
    for( let i = 0; i < array.length; i++){
        if ( array[i] === item) {
            array.splice(i, 1);
        }
    }
}
async function deleteChat(chatId, io) {
    try {
        let chat = await client.getKeyValue('chats', chatId);
        let user = await client.getKeyValue('users', chat.users[2]);
        let property = await client.getKeyValue('properties', chat.users[3]);
        deleteItem(chatId, user.chats);
        deleteItem(chatId, property.chats);
        io.in(`${property.id}`).emit(CHAT_DELETED, chatId);
        io.in(`${user.id}`).emit(CHAT_DELETED, chatId);
        // await property.sockets.map(async socketId => {
        //     await io.to(`${socketId}`).emit(CHAT_DELETED, chatId);
        // });
        // await user.sockets.map(async socketId => {
        //     await io.to(`${socketId}`).emit(CHAT_DELETED, chatId);
        // });
        await client.setKeyValue('properties', chat.users[3], property);
        await client.setKeyValue('users', chat.users[2], user);
        await client.deleteKeyValue('chats', chatId);
    } catch (err) {
        throw err
    }
}

function sendMessageToChat(sender, io) {
    return async (chatId, message, opened, id)=>{
        client.getKeyValue('chats', chatId).then(chat => {
            let newMessage = createMessage({message, sender, opened, id, chatId});
            newMessage.propertyName = chat.users[1];
            chat.messages.push(newMessage);
            client.setKeyValue('chats', chatId, chat).then(async ()=> {
                try {
                    let user = await client.getKeyValue('users', chat.users[2]);
                    let property = await client.getKeyValue('properties', chat.users[3]);
                    io.in(`${property.id}`).emit(MESSAGE_DELIVERED, newMessage);
                    io.in(`${user.id}`).emit(MESSAGE_DELIVERED, newMessage);
                    // await user.sockets.map(socketId => {
                    //     io.to(`${socketId}`).emit(MESSAGE_DELIVERED, newMessage);
                    // });
                    // await property.sockets.map(socketId => {
                    //     io.to(`${socketId}`).emit(MESSAGE_DELIVERED, newMessage);
                    // });
                    if(sender === property.id) {
                        user.badge++;
                        let notification = createNotification({alert: `${property.name} has sent you a message`, badge: user.badge, sound: 'ping.aiff'});
                        notification.payload = {
                          id: property.id,
                          type: "message"
                        };
                        let notifObject = createNotificationObject({type: "message", id: property.id});
                        console.log(notifObject);
                        user.notifications.push(notifObject.objectId);
                        console.log("Notification: ", notification);
                        apnProvider.sendNotification(user.deviceToken, notification, function(err, info) {
                            if(err)
                                throw err;
                            console.log(info);
                        });
                        await client.setKeyValue('notifications', notifObject.objectId, notifObject);
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
    deleteChat,
    deleteItem
};