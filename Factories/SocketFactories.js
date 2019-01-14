const uuidv4 = require('uuid/v4');

const createEntity = ({ name = '', id = null, sockets = [], email = '', chats = [], notifications = [] } = { }) => ({
    id: id,
    name,
    email,
    sockets,
    chats
});

const createMessage = ({ message = '', sender = '', opened = false, id = null, chatId = '' } = { }) => ({
    id: id || uuidv4(),
    date: new Date(Date.now()),
    message,
    sender,
    chatId,
    opened: false
});

const createChat = ({ messages = [], name = 'Chat', users = [] } = {}) => ({
  id: uuidv4(),
  name,
  messages,
  users,
  typingUsers: []
});
//
// const getTime = (date) => {
//   return `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`
// };

module.exports = {
    createMessage,
    createChat,
    createEntity
};