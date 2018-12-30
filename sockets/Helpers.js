const { createMessage, createEntity } = require('./Factories');
const { MESSAGE_DELIVERED } = require('./chatEvents');
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

function addConnection(socket, list, entity) {
    let newList = Object.assign({}, list);
    if(!newList[entity.id]) {

        newList[entity.id] = createEntity({name: entity.name, id: entity.id, sockets: [], email: entity.email});
        if(socket) {
            console.log(newList[entity.id]);
            if(!newList[entity.id].sockets.includes(socket.id)) {
                newList[entity.id].sockets.push(socket.id)
            }
        }

    } else {
        if(!newList[entity.id].sockets.includes(socket.id)) {
            newList[entity.id].sockets.push(socket.id)
        }
    }
    return newList;
}

function removeConnection(list, id, socketId) {
    let newList = Object.assign({}, list);
    if(newList[id].sockets.includes(socketId)) {
        for( let i = 0; i < newList[id].sockets.length; i++){
            if ( newList[id].sockets[i] === socketId) {
                newList[id].sockets.splice(i, 1);
            }
        }
    }
    // newList[id].socketId = null;
    return newList;
}

function deleteChat(chatId) {
    client.getKeyValue('chats').then(chats => {
        console.log(chats);
        if(chats.hasOwnProperty(chatId)) {
            delete chats[chatId];
            console.log(chats);
            client.setKeyValue('chats', chats).then(()=> {
                console.log('chat deleted')
            }, function (err) {
                console.log(err);
            });
        }
    }, function(err) {
        console.log(err);
    })
}

function sendMessageToChat(sender, io) {
    return async (chatId, message, opened, id)=>{
        client.getKeyValue('chats').then(chats => {
            let newMessage = createMessage({message, sender, opened, id, chatId});
            newMessage.propertyName = chats[chatId].users[1];
            chats[chatId].messages.push(newMessage);
            client.setKeyValue('chats', chats).then(()=> {
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