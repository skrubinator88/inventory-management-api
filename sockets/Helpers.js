const { createMessage, createEntity } = require('./Factories');
const { MESSAGE_DELIVERED, CHAT_DELETED } = require('./chatEvents');
const client = require('../config/Redis');
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
        console.log(newEntity);
        if(socket) {
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
        await property.sockets.map(socketId => {
            socket.to(socketId).emit(CHAT_DELETED, chatId);
        });
        await user.sockets.map(socketId => {
            socket.to(socketId).emit(CHAT_DELETED, chatId);
        });
        socket.emit(CHAT_DELETED, chatId);
        await client.setKeyValue('properties', property.id, property);
        await client.setKeyValue('users', user.id, user);
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
            client.setKeyValue('chats', chatId, chat).then(()=> {
                io.emit(MESSAGE_DELIVERED, newMessage);
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