const { MESSAGE_PROPERTY, DELETE_CHAT, CHAT_DELETED } = require('./chatEvents');
const { createChat } = require('../Factories/SocketFactories');
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
            client.getKeyValue('properties', receiver).then(function(property) {
                client.getKeyValue('users', sender).then(function(user) {
                    if(property) {
                        const newChat = createChat({ name: `${property.name}: ${user.name} - ${user.email}`, users: [user.name, property.name, user.id, property.id]});
                        property.chats.push(newChat.id);
                        user.chats.push(newChat.id);
                        client.setKeyValue('chats', newChat.id, newChat).then(async function() {
                            io.in(`${property.id}`).emit(MESSAGE_PROPERTY, newChat);
                            io.in(`${user.id}`).emit(MESSAGE_PROPERTY, newChat);
                            try {
                                await client.setKeyValue('properties', property.id, property);
                                await client.setKeyValue('users', user.id, user);
                            } catch (err) {
                                throw err
                            }
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

