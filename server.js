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

const io = require('socket.io')(server);
io.on('connection', function (socket) {
    socket.emit('new-message', message)
    socket.emit('change_guesses', attempt_dict)
    socket.on('message', (data) => {
        message = data;
        socket.broadcast.emit('new-message', message);
    });
    socket.on('create-message', (data) => {
        message = data;
        socket.broadcast.emit('add-message', message);
    });
    socket.on('change_guesses', (data) => {
        attempt_dict = data;
        console.log(attempt_dict);
        socket.broadcast.emit('decrement_guesses', attempt_dict)
    });
});


