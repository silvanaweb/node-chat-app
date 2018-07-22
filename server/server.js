const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

var {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const { Users } = require('./utils/users');

const publicPath = path.join(__dirname , '..', 'public');
// this is for heroku
const port = process.env.PORT || 3000;
console.log(publicPath);
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('new user connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required');
        }

        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList(params.room));

        socket.emit(
            'newMessage',
            generateMessage("Admin",`Welcome to the chat App Room '${params.room}'`)
        );
        // send the messege to all except the socket
        socket.broadcast.to(params.room).emit(
            'newMessage',
            generateMessage("Admin", `${params.name} has joined`)
        );


        callback();
    });


    socket.on('createMessage', (message, callback) => {
        console.log('Create message', message);
        deliverMessage(io, socket, message);
        callback('This is from the server');
    });

    socket.on('createLocationMessage', (coords) =>{
        var user = users.getUser(socket.id);
        if (user) {
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude))
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        var user = users.removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });
});

function deliverMessage(io, socket, message) {
    var user = users.getUser(socket.id);
    if (user && isRealString(message.text)) {
        io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
    }
}

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});