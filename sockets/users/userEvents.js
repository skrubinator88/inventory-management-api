'use strict';
const { USER_CONNECTED, USER_LOGOUT, DELETE_CHAT, CHAT_DELETED,
    USER_DISCONNECTED, MESSAGE_SENT, USER_CHAT_CONNECTED, CONNECT } = require('../chatEvents');
const { addConnection, removeConnection, sendMessageToChat, deleteChat } = require('../Helpers');
const { USER } = require('../chatEntities');
// const { setUsersConnected, getUsersConnected, getChats } = require('../../config/repository');

module.exports = (socket, io, client) => {

    let sendMessageToChatFromUser;

    socket.on(USER_CONNECTED, (user)=>{
        user.sockets = [];
        user.chats = [];
        client.getKeyValue('users', user.id).then(retrievedUser => {
            if(retrievedUser) {
                user = retrievedUser
            }
            let newUser = addConnection(socket, user);
            client.setKeyValue('users', user.id, newUser).then(()=> {
                socket.user = newUser;
                sendMessageToChatFromUser = sendMessageToChat(user.id, socket);
                io.emit(USER_CONNECTED, newUser);
            }, function(err) {
                console.log(err);
            });
        }, function(err) {
            console.log(err);
        });
    });

    socket.on(USER_LOGOUT, ()=>{
        if("user" in socket) {
            client.getKeyValue('users', socket.user.id).then(user => {
                let newUser = removeConnection(user, socket.id);
                client.setKeyValue('users', user.id, newUser).then(()=>{
                    io.emit(USER_DISCONNECTED, newUser);
                    console.log("Disconnect User", newUser);
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
        if("user" in socket) {
            client.getKeyValue('users',socket.user.id).then(async user => {
                if(user) {
                    let response = [];
                    await Promise.all(await user.chats.map(async chatId => {
                        let chat = await client.getKeyValue('chats', chatId);
                        if(chat) {
                            response.push(chat);
                        }
                    }));
                    socket.emit('CHATS_DELIVERED',response);
                }
            }, function (err) {
                console.log(err);
            });
        }
    });
    socket.on(DELETE_CHAT, async (chatId) => {
        if("user" in socket) {
            try {
                deleteChat(chatId, socket);
            } catch (err) {
                console.log(err)
            }
        }
    })
    socket.on('disconnect', ()=>{
        if("user" in socket ) {
            client.getKeyValue('users', socket.user.id).then(user => {
                let newUser = removeConnection(user, socket.id);
                client.setKeyValue('users', user.id, newUser).then(()=> {
                    io.emit(USER_DISCONNECTED, newUser);
                }, function (err) {
                    console.log(err);
                });
            }, function (err) {
                console.log(err);
            });
        }
    });
};