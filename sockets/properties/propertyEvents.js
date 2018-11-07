'use strict';
const { PROPERTY_CONNECTED, PROPERTY_LOGOUT,
    PROPERTY_DISCONNECTED, CHAT_REQUEST,
    PROPERTY_CHAT_CONNECTED, PROPERTY_MESSAGE_SENT} = require('../chatEvents');
const { createMessage } = require('../Factories');
const { addConnection, removeConnection, sendMessageToChat } = require('../Helpers');
const { setPropertiesConnected, getPropertiesConnected, getChats } = require('../repository');

module.exports = (socket, io) => {

    let sendMessageToChatFromProperty;

    socket.on(PROPERTY_CONNECTED, (property)=>{
        let connectedProperties = getPropertiesConnected();
        property.socketId = socket.id;
        let chats = [];
        let newConnectedProperties = addConnection(socket, connectedProperties, property, chats);
        setPropertiesConnected(newConnectedProperties);
        socket.property = property;

        sendMessageToChatFromProperty = sendMessageToChat(property.id, io);
        io.emit(PROPERTY_CONNECTED, newConnectedProperties);
        console.log(newConnectedProperties);
    });

    socket.on(PROPERTY_CHAT_CONNECTED, (id) => {
        let chats = getChats();
        let response = [];
        let properties = getPropertiesConnected();
        let property = properties[id];
        if(property) {
            for(let i = 0; i < property.chats.length; i++) {
                let propertyChatId = property.chats[i];
                if(chats[propertyChatId]) {
                    response.push(chats[propertyChatId])
                }
            }
        }
        socket.emit('CHATS_DELIVERED',response);
    });

    socket.on(PROPERTY_MESSAGE_SENT, ({chatId, message, id})=>{
        sendMessageToChatFromProperty(chatId,message,false,id)
    });

    socket.on(PROPERTY_LOGOUT, ()=>{
        if("property" in socket) {
            let connectedProperties = getPropertiesConnected();
            let newConnectedProperties = removeConnection(connectedProperties, socket.property.id);
            setPropertiesConnected(newConnectedProperties);
            io.emit(PROPERTY_DISCONNECTED, newConnectedProperties);
            console.log("Disconnect Property",newConnectedProperties);
        }
    });

    socket.on('disconnect', ()=>{
        if("property" in socket ) {
            let connectedProperties = getPropertiesConnected();
            let newConnectedProperties = removeConnection(connectedProperties, socket.property.id);
            setPropertiesConnected(newConnectedProperties);
            io.emit(PROPERTY_DISCONNECTED, newConnectedProperties);
            console.log("Disconnect: ",newConnectedProperties);
        }
    })
};