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

    function addMessageToList(message) {
        var li = $('<li></li>');
        li.text(`${message.from}: ${message.text}`);
        $('#messages').append(li);
    }

    if ("geolocation" in navigator) {
        console.log('geolocation available');
    } else {
        console.log('geolocation NOT available');
        /* geolocation IS NOT available */
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
})(jQuery);