const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public/dist/public'));

require('./server/routes.js')(app);

const server = app.listen(4000, ()=> {
    console.log("ExpressJS Server listening on port 4000");
})

var rem_attempts = 3;
var message = 'Start Coding!';
var game_text = 'You have 3 attempts remaining!'
var gameEnd = false;
const io = require('socket.io')(server);
io.on('connection', function (socket) {
    socket.emit('new-message', message)
    socket.emit('change_guesses', rem_attempts)
    socket.on('message', (data) => {
        message = data;
        socket.broadcast.emit('new-message', message);
    });
    socket.on('create-message', (data) => {
        message = data;
        socket.broadcast.emit('add-message', message);
    });
    socket.on('change_guesses', (data) => {
        rem_attempts = data;
        socket.broadcast.emit('decrement_guesses', rem_attempts)
    });

});


