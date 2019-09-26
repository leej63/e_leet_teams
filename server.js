const express = require('express');
const app = express();

app.use(express.json());
app.use(express.static(__dirname + '/public/dist/public'));

require('./server/routes.js')(app);

const server = app.listen(4000, ()=> {
    console.log("ExpressJS Server listening on port 4000");
})

var message = 'Start Coding!';
const io = require('socket.io')(server);
io.on('connection', function (socket) {
    socket.emit('new-message', message)
    socket.on('message', (data) => {
        message = data;
        socket.broadcast.emit('new-message', message);
    })

    socket.on('create-message', (data) => {
        message = data;
        socket.broadcast.emit('add-message', message);
    })

});


