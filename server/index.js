const server = require('http').createServer();
const io = require('socket.io')(server);

const chatRooms = new Map();
chatRooms.set('1', {});

const handleMessage = (client, data) => {
    const { roomID, feed } = data;
    if (!roomID || !feed) {
        return;
    }

    const { userID, message } = feed;

    if (!userID || !message) {
        return;
    }

    const chatRoom = chatRooms.get(roomID);

    const { msgHistory = [], clientSet = {} } = chatRoom;

    chatRooms.set(roomID, {
        clientSet: {
            ...clientSet,
            ...{ [client.id]: client }
        },
        msgHistory: [
            ...msgHistory,
            {
                userID,
                message: {
                    timeStamp: Date.now(),
                    content: message
                }
            }
        ]
    });
};

const handleMsgSync = (client, { roomID }) => {
    const { clientSet, msgHistory } = chatRooms.get(roomID);

    const clientsArr = Object.entries(clientSet);
    if (clientSet && clientsArr.length > 0) {
        console.log('clientsArr', clientsArr.length);
        clientsArr.forEach(client => {
            client[1].emit('channel', {
                error: null,
                data: {
                    roomID,
                    msgHistory: [msgHistory[msgHistory.length - 1]]
                }
            });
        });
    } else {
        client.emit('channel', {
            error: 'Bad Request',
            data: null
        });
    }
};

io.on('connection', client => {
    console.log(client.id);

    client.on('channel', data => {
        console.log('channel Data is ', data);

        handleMessage(client, data);

        handleMsgSync(client, data);
    });

    client.on('getHistory', data => {
        const { roomID } = data;
        const { clientSet, msgHistory } = chatRooms.get(roomID);
        if (!clientSet || !msgHistory) {
            client.emit('channel', {
                error: 'Bad Request',
                data: null
            });
            return;
        }

        client.emit('channel', {
            error: null,
            data: { roomID, msgHistory }
        });
    });

    client.on('error', err => {
        console.log(`Received error form client ${client.id}`, err);
    });
});

server.listen(8000, () => {
    console.log('Listening on port %s', 8000);
});
