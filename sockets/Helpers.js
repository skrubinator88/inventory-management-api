const { createMessage, createEntity } = require('./Factories');
const { MESSAGE_DELIVERED } = require('./chatEvents');
const client = require('../config/Redis');

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
        if(socket)
            newList[entity.id] = createEntity({name: entity.name, id: entity.id, socketId: socket.id, email: entity.email});
        else
            newList[entity.id] = createEntity({name: entity.name, id: entity.id, socketId: null, email: entity.email});
    } else {
        newList[entity.id].socketId = socket.id
    }
    return newList;
}

function removeConnection(list, id) {
    let newList = Object.assign({}, list);
    newList[id].socketId = null;
    return newList;
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
    sendMessageToChat
};