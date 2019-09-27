const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public/dist/public'));

require('./server/routes.js')(app);

const server = app.listen(4000, ()=> {
    console.log("ExpressJS Server listening on port 4000");
})

var attempt_dict = {'rem_attempts' : 3,
    'game_end' : false,
    'game_text' : 'You have 3 attempt(s) remaining!',
    'error_message' : ""};

var message = 'Start Coding!';

var new_game = {
    'current_question': "",
    'number' : 0,
    'game_instance' : "",
    'seconds' : 0,
    'minutes' : 25,
    'counter' : 1500
}

const io = require('socket.io')(server);
io.on('connection', function (socket) {
    socket.emit('new-message', message);
    socket.emit('begin_game', true);
    socket.emit('decrement_guesses', attempt_dict);
    socket.emit('initiate_new_game', new_game);
    socket.on('message', (data) => {
        message = data;
        socket.broadcast.emit('new-message', message);
    });
    socket.on('start_game', (data) => {
        socket.broadcast.emit('begin_game', true);
    });
    socket.on('new_game', (data) => {
        new_game = data;
        console.log("This is from socke on new game");
        console.log(data['current_question']);
        socket.broadcast.emit('initate_new_game', new_game);
    });
    socket.on('create-message', (data) => {
        socket.broadcast.emit('add-message', data);
    });
    socket.on('change_guesses', (data) => {
        attempt_dict = data;
        socket.broadcast.emit('decrement_guesses', attempt_dict)
    });
});


