const { MESSAGE_PROPERTY, DELETE_CHAT, CHAT_DELETED } = require('./chatEvents');
const { createChat } = require('./Factories');
const { deleteChat } = require('./Helpers');

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
                                if(property.sockets.length > 0) {
                                    const propertySockets = property.sockets;
                                    for(let i = 0; i < propertySockets.length; i++) {
                                        console.log(chats);
                                        socket.to(propertySockets[i]).emit(MESSAGE_PROPERTY, newChat);
                                    }
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

        socket.on(DELETE_CHAT, (chatId) => {
            deleteChat(chatId);
            io.emit(CHAT_DELETED, chatId);
        })
    });
};

