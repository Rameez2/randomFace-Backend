const PORT = process.env.PORT || 3001;
const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Import Server from socket.io
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your React app's URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    },
});


let currentUsers = [];

io.on('connection', (socket) => {

    // let initiator = currentUsers.shift();
    socket.emit('initiator-status',currentUsers.length);
    socket.emit('get-initiator',currentUsers[0]);

    socket.on('answer',(data) => {
        // console.log('got answer signalData',data.signalData);
        console.log('got answer Socket ID',data.sokcetId);
        socket.to(data.sokcetId).emit('get-answer',{signalData:data.signalData})

        // Remove initiator after Answer
        currentUsers = currentUsers.filter(user => user.socketId !== data.sokcetId);
    })

    socket.on('create-initiator',(data) => {
        // initiator offer store in currentUsers
        currentUsers.push({
            signalData:data.signalData,
            socketId:socket.id
        })
        console.log('user list updated',socket.id);
    })

    socket.on('initiator-closed',() => {
        currentUsers = currentUsers.filter(user => user.socketId !== socket.id);
    })
/*

    offer --> Node --> normalPeer answer --> Node --> init

    get your Own Call id (initiator) --> Node Server --> other Peer signal(initId) --> Node Server --> Initiator --> signal(otherId)

    get your Own Call id (initiator) --> Node Server --> other Peer signal(initId)
        --> Node Server --> Initiator --> signal(otherId)

*/

    socket.on('disconnect', () => {
        console.log('user disconnected');
        currentUsers = currentUsers.filter(user => user.socketId !== socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});
