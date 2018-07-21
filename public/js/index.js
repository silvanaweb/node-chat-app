var socket = io();

    socket.on('connect', () => {
        console.log('Connected to server');
    });
    socket.on('disconnect', () => {
        console.log('Diconnected from server');
    });

    socket.on('newMessage', function(data) {
        console.log('new message', data);
    });