const { createMessage, createEntity } = require('./Factories');
const { MESSAGE_DELIVERED } = require('./chatEvents');
const { getChats, setChats } = require('./repository');

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
        newList[entity.id] = createEntity({name: entity.name, id: entity.id, socketId: socket.id, email: entity.email});
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
    return(chatId, message, opened, id)=>{
        let chats = getChats();
        let newMessage = createMessage({message, sender, opened, id, chatId});
        chats[chatId].messages.push(newMessage);
        setChats(chats);
        io.emit(MESSAGE_DELIVERED, newMessage);
    }
}

module.exports = {
    isUser,
    addConnection,
    removeConnection,
    sendMessageToChat
};