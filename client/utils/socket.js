import io from 'socket.io-client';

const URL = 'http://localhost:8000';

// Defince the client socket event
export default class Client {
    constructor() {
        this.socket = io.connect(URL);
        this.socket.on('error', err => {
            console.log('Client received socket error:', err);
        });
    }

    addMessage(onMessageReceived) {
        this.socket.on('channel', onMessageReceived);
    }

    unregisterHandler() {
        this.socket.off('channel');
    }
}
