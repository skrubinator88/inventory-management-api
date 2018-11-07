'use strict';
let usersConnected = {  };
let propertiesConnected = {  };
let chats = {  };

module.exports = {
    setUsersConnected : function(newVal){ usersConnected = newVal; },
    setPropertiesConnected : function(newVal){ propertiesConnected = newVal },
    getUsersConnected : function(){ return usersConnected },
    getPropertiesConnected: function () { return propertiesConnected },
    getChats: function () { return chats },
    setChats: function(newVal){ chats = newVal }

};