'use strict';
const { PROPERTY_CONNECTED, PROPERTY_LOGOUT, ALREADY_CONNECTED,
    PROPERTY_DISCONNECTED, PROPERTY_CHAT_CONNECTED, PROPERTY_MESSAGE_SENT, DELETE_CHAT, CHAT_DELETED } = require('../chatEvents');
const { addConnection, removeConnection, sendMessageToChat, deleteChat } = require('../Helpers');
// const { setPropertiesConnected, getPropertiesConnected, getChats } = require('../../config/repository');

module.exports = (socket, io, client) => {

    let sendMessageToChatFromProperty;
    socket.on(PROPERTY_CONNECTED, (property)=>{
        property.sockets = [];
        property.chats = [];
        console.log(property);
        client.getKeyValue('properties', property.id).then(retrievedProperty => {
            if(retrievedProperty) {
                retrievedProperty.email = property.email;
                property = retrievedProperty;

            }
            let newProperty = addConnection(socket, property);
            client.setKeyValue('properties', property.id, newProperty).then(()=> {
                socket.property = property;
                sendMessageToChatFromProperty = sendMessageToChat(property.id, io);
                io.emit(PROPERTY_CONNECTED, newProperty);
                console.log(newProperty);
            }, function(err) {
                console.log(err);
            });
        }, function(err) {
            console.log(err);
        });
    });

    socket.on(PROPERTY_CHAT_CONNECTED, () => {
        if("property" in socket) {
            client.getKeyValue('properties',socket.property.id).then(async property => {
                if(property) {
                    let response = await Promise.all(await property.chats.map(async chatId => {
                        let chat = await client.getKeyValue('chats', chatId);
                        if(!!chat)
                            return chat
                    }));
                    console.log(response);
                    socket.emit('CHATS_DELIVERED',response);
                }
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
            client.getKeyValue('properties', socket.property.id).then(property => {
                let newProperty = removeConnection(property, socket.id);
                client.setKeyValue('properties', property.id, newProperty).then(()=>{
                    io.emit(PROPERTY_DISCONNECTED, newProperty);
                    console.log("Disconnect User", newProperty);
                }, function (err) {
                    console.log(err);
                });
            }, function (err) {
                console.log(err);
            });
        }
    });
    socket.on('disconnect', ()=>{
        if("property" in socket ) {
            client.getKeyValue('properties', socket.property.id).then(property => {
                console.log("Property disconnected");
                let newProperty = removeConnection(property, socket.id);
                client.setKeyValue('properties', property.id, newProperty).then(()=> {
                    io.emit(PROPERTY_DISCONNECTED, newProperty);
                }, function (err) {
                    console.log(err);
                });
            }, function (err) {
                console.log(err);
            });
        }
    })
};