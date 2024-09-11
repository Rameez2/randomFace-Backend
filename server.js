const PORT = process.env.PORT || 3001;
const express = require('express');
const http = require('http');
const { Server } = require('socket.io'); // Import Server from socket.io
const cors = require('cors');
const authRoutes = require("./src/routes/authRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const verificationRoutes = require("./src/routes/verificationRoute");
const adminRoutes = require("./src/routes/adminRoutes");
const path = require('path');
require('dotenv').config();
// DB Connection
require("./src/config/dbConnection")();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Replace with your React app's URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type'],
    },
});


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '/src/public')));

// Middlewares
app.use(express.json())

// ROUTERS
app.use('/api/auth',authRoutes);

app.use('/api',profileRoutes);

app.use('/api',verificationRoutes);

app.use('/api/admin',adminRoutes);

// SOCKETS
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
