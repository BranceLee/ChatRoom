const server = require('http').createServer();
const io = require('socket.io')(server);

io.on('connection', client => {
    console.log(client.id);

    client.on('channel', data => {
        console.log('Data is ', data);

        client.emit('channel', data);
    });

    client.on('error', err => {
        console.log(`Received error form client ${client.id}`, err);
    });
});

server.listen(8000, () => {
    console.log('Listening on port %s', 8000);
});
