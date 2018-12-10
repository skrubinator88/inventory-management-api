const { PROPERTY_CONNECTED, MESSAGE_SENT, MESSAGE_PROPERTY, PROPERTY_LOGOUT, PROPERTY_DISCONNECTED, CHAT_REQUEST, NEW_CHAT } = require('./chatEvents');
const { createProperty, createMessage, createChat } = require('./Factories');
const { removeConnection, sendMessageToChat } = require('./Helpers');
const { setPropertiesConnected, setUsersConnected, getUsersConnected, getPropertiesConnected, getChats, setChats } = require('../config/repository');

module.exports = (io, client) => {
    io.on('connection', (socket)=>{

        function serverError(err, message) {
           console.log(err);
           socket.emit('serverError', { message: message });
       }
       //user events
        require('./users/userEvents')(socket, io, client);
        //property events
        require('./properties/propertyEvents')(socket, io, client);

        socket.on(MESSAGE_PROPERTY, ({receiver, sender})=>{
            console.log(receiver);
            client.getKeyValue('properties').then(function(connectedProperties) {
                client.getKeyValue('users').then(function(connectedUsers) {
                    console.log(connectedProperties);
                    if(receiver in connectedProperties) {
                        console.log(receiver);
                        let property = connectedProperties[receiver];
                        let user = connectedUsers[sender];
                        const newChat = createChat({ name: `${property.name}: ${user.name} - ${user.email}`, users: [user.name, property.name]});
                        console.log(newChat);
                        client.getKeyValue('chats').then(function(chats) {
                            console.log(chats);
                            console.log("We made it here");
                            chats[newChat.id] = newChat;
                            property.chats.push(newChat.id);
                            user.chats.push(newChat.id);
                            connectedUsers[sender] = user;
                            connectedProperties[receiver] = property;
                            client.setKeyValue('chats', chats).then(function() {
                                const propertySocket = property.socketId;
                                console.log(chats);
                                if(propertySocket) {
                                    socket.to(propertySocket).emit(MESSAGE_PROPERTY, newChat);
                                }
                                socket.emit(MESSAGE_PROPERTY, newChat)
                            }, function (err) {
                                console.log(err);
                            });
                        },function (err) {
                            console.log(err);
                        });
                    }
                }, function (err) {
                    console.log(err);
                });
            }, function (err) {
                console.log(err)
            });
        });
    });
};

