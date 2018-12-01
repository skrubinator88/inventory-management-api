'use strict';
const { USER_CONNECTED, USER_LOGOUT,
    USER_DISCONNECTED, MESSAGE_SENT, USER_CHAT_CONNECTED } = require('../chatEvents');
const { createMessage, createChat } = require('../Factories');
const { addConnection, removeConnection, sendMessageToChat } = require('../Helpers');
// const { setUsersConnected, getUsersConnected, getChats } = require('../../config/repository');

module.exports = (socket, io, client) => {

    let sendMessageToChatFromUser;

    socket.on(USER_CONNECTED, (user)=>{
        user.socketId = socket.id;
        client.getKeyValue('users').then(connectedUsers => {
            let chats = [];
            let newConnectedUsers = addConnection(socket, connectedUsers, user, chats);
            client.setKeyValue('users',newConnectedUsers).then(()=> {
                socket.user = user;
                sendMessageToChatFromUser = sendMessageToChat(user.id, io);
                io.emit(USER_CONNECTED, newConnectedUsers);
                console.log(newConnectedUsers);
            }, function (err) {
                console.log(err);
            });
        }, function (err) {
            console.log(err);
        });
    });
    socket.on(USER_LOGOUT, ()=>{
        if("user" in socket) {
            client.getKeyValue('users').then(connectedUsers => {
                console.log(connectedUsers);
                let newConnectedUsers = removeConnection(connectedUsers, socket.user.id);
                client.setKeyValue('users', newConnectedUsers).then(()=>{
                    io.emit(USER_DISCONNECTED, newConnectedUsers);
                    console.log("Disconnect User", newConnectedUsers);
                }, function (err) {
                    console.log(err);
                });
            }, function (err) {
                console.log(err);
            });
        }
    });

    socket.on(MESSAGE_SENT, ({chatId, message, id})=>{
        if("user" in socket) {
            sendMessageToChatFromUser = sendMessageToChat(socket.user.id, io);
            sendMessageToChatFromUser(chatId,message,false,id)
        }
    });

    socket.on(USER_CHAT_CONNECTED, () => {
        console.log("User chat has connected");
        if("user" in socket) {
            client.getKeyValue('chats').then(chats => {
                let response = [];
                client.getKeyValue('users').then(users => {
                    let user = users[socket.user.id];
                    if(user) {
                        for(let chat in chats) {
                            if(chats[chat].users.includes(user.name)){
                                response.push(chats[chat])
                            }
                        }
                    }
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

    socket.on('disconnect', ()=>{
        if("user" in socket ) {
            client.getKeyValue('users').then(connectedUsers => {
                console.log("User disconnected");
                let newConnectedUsers = removeConnection(connectedUsers, socket.user.id);
                client.setKeyValue('users', newConnectedUsers).then(()=> {
                    io.emit(USER_DISCONNECTED, newConnectedUsers);
                }, function (err) {
                    console.log(err);
                });
            }, function (err) {
                console.log(err);
            });
        }
    });
};