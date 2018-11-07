const { PROPERTY_CONNECTED, MESSAGE_SENT, MESSAGE_PROPERTY, PROPERTY_LOGOUT, PROPERTY_DISCONNECTED, CHAT_REQUEST, NEW_CHAT } = require('./chatEvents');
const { createProperty, createMessage, createChat } = require('./Factories');
const { removeConnection, sendMessageToChat } = require('./Helpers');
const { setPropertiesConnected, setUsersConnected, getUsersConnected, getPropertiesConnected, getChats, setChats } = require('./repository');

module.exports = (io, client) => {
    io.on('connection', (socket)=>{

        function serverError(err, message) {
           console.log(err);
           socket.emit('serverError', { message: message });
       }
       //user events
        require('./users/userEvents')(socket, io);
        //property events
        require('./properties/propertyEvents')(socket, io);

        socket.on(MESSAGE_PROPERTY, ({receiver, sender})=>{
            let connectedProperties = getPropertiesConnected();
            let connectedUsers = getUsersConnected();
            if(receiver in connectedProperties) {
                let property = connectedProperties[receiver];
                let user = connectedUsers[sender];
                const newChat = createChat({ name: `${property.name}: ${user.name} - ${user.email}`, users: [user.name, property.name]});
                let chats = getChats();
                chats[newChat.id] = newChat;
                property.chats.push(newChat.id);
                user.chats.push(newChat.id);
                setChats(chats);
                const propertySocket = property.socketId;
                console.log(chats);
                socket.to(propertySocket).emit(MESSAGE_PROPERTY, newChat);
                socket.emit(MESSAGE_PROPERTY, newChat)
            }
        });
    });
};

