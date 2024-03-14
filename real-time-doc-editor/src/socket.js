function socketIoConnection(io) {
    const documentNameSpace = io.of('/document'); // this helps incase on same server we have different namespaces, like different games
    let room;
    documentNameSpace.on('connection', (socket) => {
        console.log('New client connected', socket.id);

        socket.on('joinDocument', (roomName) => {
            socket.join(roomName);
            console.log(`Client ${socket.id} joined room ${roomName}`);
        });

        socket.on('disconnect', (reason) => { // when a player disconnects
            console.log('Client disconnected', socket.id, reason);
        });
    });
    return documentNameSpace;
}

module.exports = {socketIoConnection};