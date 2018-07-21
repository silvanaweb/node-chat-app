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
        var time = moment(message.createdAt).format('h:mm a');
        var li = $('<li></li>');
        li.text(`${message.from} ${time}: ${message.text}`);
        $('#messages').append(li);
    }
    function addMessageLocationToList(message) {
        var time = moment(message.createdAt).format('h:mm a');
        var li = $('<li></li>');
        var a = $('<a target="_blank">My current location</a>');
        li.text(`${message.from} ${time}: `);
        a.attr('href', message.url);
        li.append(a);

        $('#messages').append(li);
    }


    $('#myform').on('submit', function (e) {
        e.preventDefault();
        var msgBox = $('#message');
        socket.emit(
            'createMessage',
            {
                from: "Frank",
                text: msgBox.val()
            },
            function (data) {
                msgBox.val('');
                console.log('Messae sent:', data);
            }
        );
    });

    var locationButton = $('#send-location');
    locationButton.on('click', function () {
        if (!navigator["geolocation"]) {
            return alert('Geolocation not available by your browser');
        }
        locationButton.attr('disabled', 'disabled').text('Sending location...');
        navigator.geolocation.getCurrentPosition(function (position) {
            locationButton.removeAttr('disabled').text('Send location');
            socket.emit('createLocationMessage', {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            });
        }, function () {
            locationButton.removeAttr('disabled').text('Send location');
            alert('Unable to fetch locaiton');
        });
    })

})(jQuery);