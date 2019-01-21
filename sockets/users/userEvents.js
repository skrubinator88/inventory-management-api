'use strict';
const { USER_CONNECTED, USER_LOGOUT, DELETE_CHAT, CHAT_DELETED,
    USER_DISCONNECTED, MESSAGE_SENT, USER_CHAT_CONNECTED, NOTIFICATIONS_SENT } = require('../chatEvents');
const { addConnection, removeConnection, sendMessageToChat, deleteChat, deleteItem } = require('../Helpers');
const { USER } = require('../chatEntities');
// const { setUsersConnected, getUsersConnected, getChats } = require('../../config/repository');

module.exports = (socket, io, client) => {

    let sendMessageToChatFromUser;

    socket.on(USER_CONNECTED, (user)=>{
        user.chats = [];
        user.notifications = [];
        client.getKeyValue('users', user.id).then(retrievedUser => {
            if(retrievedUser) {
                retrievedUser.deviceToken = user.deviceToken;
                user = retrievedUser
            }
            let newUser = addConnection(socket, user);

            client.setKeyValue('users', user.id, newUser).then(async ()=> {
                socket.user = newUser;
                sendMessageToChatFromUser = sendMessageToChat(user.id, io);
                let notifications = [];
                if(newUser.notifications) {
                    for(let i = 0; i < newUser.notifications.length; i++) {
                        let notification = await client.getKeyValue('notifications', newUser.notifications[i]);

                        await client.deleteKeyValue('notifications', newUser.notifications[i]);
                        notifications.push(notification);
                        newUser.deleteItem(newUser.notifications[i], newUser.notifications);
                    }
                }
                client.setKeyValue('users', newUser.id, newUser);
                io.in(`${newUser.id}`).emit(NOTIFICATIONS_SENT, notifications);
                // if(newUser.sockets) {
                //     for(let i = 0; i < newUser.sockets.length; i++) {
                //         io.to(`${newUser.sockets[i]}`).emit(NOTIFICATIONS_SENT, notifications);
                //     }
                // }
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
                deleteChat(chatId, io);
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