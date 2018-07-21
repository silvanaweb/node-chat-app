(function ($) {

    var socket = io();

    socket.on('connect', () => {
        console.log('Connected to server');
    });
    socket.on('disconnect', () => {
        console.log('Diconnected from server');
    });

    socket.on('newMessage', function (data) {
        console.log('new message', data);
        addMessageToList(data);
    });

    socket.on('newLocationMessage', function (data) {
        console.log('new message', data);
        addMessageLocationToList(data);
    });

    function addMessageToList(message) {
        var li = $('<li></li>');
        li.text(`${message.from}: ${message.text}`);
        $('#messages').append(li);
    }
    function addMessageLocationToList(message) {
        var li = $('<li></li>');
        var a = $('<a target="_blank">My current location</a>');
        li.text(`${message.from}: `);
        a.attr('href', message.url);
        li.append(a);

        $('#messages').append(li);
    }


    $('#myform').on('submit', function (e) {
        e.preventDefault();
        socket.emit(
            'createMessage',
            {
                from: "Frank",
                text: $('#message').val()
            },
            function (data) {
                console.log('Messae sent:', data);
            }
        );
    });

    var locationButton = $('#send-location');
    locationButton.on('click', function () {
        if (!navigator["geolocation"]) {
            return alert('Geolocation not available by your browser');
        }

        navigator.geolocation.getCurrentPosition(function (position) {
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function () {
            alert('Unable to fetch locaiton');
        });
    })

})(jQuery);