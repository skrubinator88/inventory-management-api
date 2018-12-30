'use strict';
const { PROPERTY_CONNECTED, PROPERTY_LOGOUT, ALREADY_CONNECTED,
    PROPERTY_DISCONNECTED, PROPERTY_CHAT_CONNECTED, PROPERTY_MESSAGE_SENT } = require('../chatEvents');
const { addConnection, removeConnection, sendMessageToChat } = require('../Helpers');
// const { setPropertiesConnected, getPropertiesConnected, getChats } = require('../../config/repository');

module.exports = (socket, io, client) => {

    let sendMessageToChatFromProperty;

    socket.on(PROPERTY_CONNECTED, (property)=>{
        client.getKeyValue('properties').then(connectedProperties => {
            property.sockets = [];
            property.sockets.push(socket.id);
            let chats = [];
            // if(connectedProperties.hasOwnProperty(property.id)) {
            //     if(!!connectedProperties[property.id].socketId) {
            //         return socket.emit(ALREADY_CONNECTED);
            //     }
            // }
            let newConnectedProperties = addConnection(socket, connectedProperties, property, chats);
            client.setKeyValue('properties',newConnectedProperties).then(()=>{
                socket.property = property;
                sendMessageToChatFromProperty = sendMessageToChat(property.id, io);
                io.emit(PROPERTY_CONNECTED, newConnectedProperties);
            });
        });
    });

    socket.on(PROPERTY_CHAT_CONNECTED, () => {
        if('property' in socket) {
            client.getKeyValue('chats').then(chats => {
                let response = [];
                client.getKeyValue('properties').then(properties => {
                    let property = properties[socket.property.id];
                    if(property) {
                        for(let chat in chats) {
                            if(chats[chat].users.includes(property.name)){
                                response.push(chats[chat])
                            }
                        }
                    }
                    console.log("property chat connected");
                    console.log(response);
                    socket.emit('CHATS_DELIVERED',response);
                }, function (err) {
                    console.log(err);
                });
            }, function (err) {
                console.log(err);
            });
        }
    });

    socket.on(PROPERTY_MESSAGE_SENT, ({chatId, message, id})=>{
        if("property" in socket) {
            sendMessageToChatFromProperty = sendMessageToChat(socket.property.id, io);
            sendMessageToChatFromProperty(chatId,message,false,id)
        }
    });

    socket.on(PROPERTY_LOGOUT, ()=>{
        if("property" in socket) {
            client.getKeyValue('properties').then(connectedProperties => {
                let newConnectedProperties = removeConnection(connectedProperties, socket.property.id, socket.id);
                socket.disconnect();
                client.setKeyValue('properties',newConnectedProperties).then(()=>{
                    io.emit(PROPERTY_DISCONNECTED, newConnectedProperties);
                }, function (err) {
                    console.log(err)
                });
            }, function (err) {
                console.log(err)
            });
        }
    });

    socket.on('disconnect', ()=>{
        if("property" in socket ) {
            client.getKeyValue('properties').then(connectedProperties => {
                let newConnectedProperties = removeConnection(connectedProperties, socket.property.id, socket.id);
                client.setKeyValue('properties',newConnectedProperties).then(()=> {
                    io.emit(PROPERTY_DISCONNECTED, newConnectedProperties);
                }, function (err) {
                    console.log(err)
                });
            }, function (err) {
                console.log(err)
            });
        }
    })
};