import io from 'socket.io-client';

const URL = 'http://localhost:3000';

// Defince the client socket event
export default class Client {
  constructor() {
    this.socket = io.connect(URL);
    this.socket.on('error', err => {
      console.log('Client received socket error:', err);
    });
  }

  registerHandler(onMessageReceived) {
    this.socket.on('message', onMessageReceived);
  }

  unregisterHandler() {
    this.socket.off('message');
  }

  register(userName, func) {
    this.socket.emit('register', userName, func);
  }

  join(chatroomName, func) {
    this.socket.emit('join', chatroomName, func);
  }

  leave(chatroomName, func) {
    this.socket.emit('leave', chatroomName, func);
  }

  message(chatroomName, msg, func) {
    this.socket.emit('message', { chatroomName, message: msg }, func);
  }

  getChatrooms(func) {
    this.socket.emit('chatrooms', null, func);
  }

  getAvailableUsers(func) {
    this.socket.emit('availableUsers', null, func);
  }
}
