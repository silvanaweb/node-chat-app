(function ($) {

    var socket = io();

    socket.on('connect', () => {
        console.log('Connected to server');
        var params = $.deparam(window.location.serach);
        socket.emit('join', params, function(err) {
            if (err) {
                alert(err);
                window.location.href = '/';
            } else {
                console.log('no error');
            }
        });
    });
    socket.on('disconnect', () => {
        console.log('Diconnected from server');

    });

    socket.on('updateUserList', function(users) {
        var ol = $('<ol></ol>');
        users.forEach(user => {
            ol.append($('<li></li>').text(user));
        });
        $('#users').html(ol);
    });

    socket.on('newMessage', function (data) {
        console.log('new message', data);
        addMessageToList(data);
    });

    socket.on('newLocationMessage', function (data) {
        console.log('new message', data);
        addMessageLocationToList(data);
    });

    function scrollToBottom() {
        var messages = $('#messages');
        var newMessae = messages.children('li:last-child');
        var clientHeight = messages.prop('clientHeight');
        var scrollTop = messages.prop('scrollTop');
        var scrollHeight = messages.prop('scrollHeight');
        var newMessageHeight = newMessae.innerHeight();
        var lastMessageHeight = newMessae.prev().innerHeight();

        if ( clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
            messages.scrollTop(scrollHeight);
        }
    }

    function addMessageToList(message) {
        var time = moment(message.createdAt).format('h:mm a');
        var template = $('#message-template').html();
        var html = Mustache.render(template, {
            text: message.text,
            from: message.from,
            time: time
        });

        $('#messages').append(html);
        scrollToBottom();
    }
    function addMessageLocationToList(message) {
        var time = moment(message.createdAt).format('h:mm a');
        var template = $('#location-message-template').html();
        var html = Mustache.render(template, {
            url: message.url,
            from: message.from,
            time: time
        });

        $('#messages').append(html);
        scrollToBottom();
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