const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname + 'server', '..', 'public');
// this is for heroku
const port = process.env.PORT || 3000;

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.emit(
        'newMessage',
        generateMessage("Admin","Welcome to the chat App")
    );
    // send the messege to all except the socket
    socket.broadcast.emit(
        'newMessage',
        generateMessage("Admin", "New user joined")
    );

    socket.on('createMessage', (message, callback) => {
        console.log('Create message', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from the server');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});