'use strict';
const { NEW_CHAT, USER_CONNECTED, USER_LOGOUT, USER_DISCONNECTED, MESSAGE_SENT } = require('../chatEvents');
const { createMessage, createChat } = require('../Factories');
const { addConnection, removeConnection, sendMessageToChat } = require('../Helpers');
const { setUsersConnected, getUsersConnected} = require('../repository');

module.exports = (socket, io) => {

    let sendMessageToChatFromUser;

    socket.on(USER_CONNECTED, (user)=>{
        user.socketId = socket.id;
        let connectedUsers = getUsersConnected();
        let chats = [];
        let newConnectedUsers = addConnection(socket, connectedUsers, user, chats);
        setUsersConnected(newConnectedUsers);
        socket.user = user;
        sendMessageToChatFromUser = sendMessageToChat(user.id, io);

        io.emit(USER_CONNECTED, newConnectedUsers);
        console.log(newConnectedUsers);
    });
    //
    // socket.on(NEW_CHAT, (propertyName, cb)=>{
    //     let newChat = createChat();
    //     newChat.name = propertyName;
    //     console.log('new chat created');
    //     cb(newChat)
    // });

    socket.on(USER_LOGOUT, ()=>{
        if("user" in socket) {
            let connectedUsers = getUsersConnected();
            let newConnectedUsers = removeConnection(connectedUsers, socket.user.id);
            setUsersConnected(newConnectedUsers);
            io.emit(USER_DISCONNECTED, newConnectedUsers);
            console.log("Disconnect User", newConnectedUsers);
        }
    });

    socket.on(MESSAGE_SENT, ({chatId, message, id})=>{
        sendMessageToChatFromUser(chatId,message,false,id)
    });

    socket.on('disconnect', ()=>{
        if("user" in socket ) {
            let connectedUsers = getUsersConnected();
            let newConnectedUsers = removeConnection(connectedUsers, socket.user.id);
            setUsersConnected(newConnectedUsers);
            io.emit(USER_DISCONNECTED, newConnectedUsers);
            console.log("Disconnect: ",newConnectedUsers);
        }
    })
};