
const express = require('express');
const app = express();

const http = require('http');

const server = http.Server(app);

const socket = require('socket.io');

const io = socket(server);

app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
    socket.on('draw_line', function (data) {
        io.emit('draw_line', data);
    });

    socket.on('clear_canvas', function () {
        io.emit('clear_canvas');
    });

    socket.on('save', function () {
        io.emit('save');
    });

});

server.listen(8000, function(){
    console.log("server listening on 8000");
});