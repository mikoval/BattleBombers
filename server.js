var express = require('express');
var app = express();
var port = process.env.PORT || 8080;


var server = app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
  res.render('index.ejs', { title: 'Hey', message: 'Hello there!' })
})


var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);
var rooms = {}
function newConnection(socket){
    console.log("new socket connection: " + socket.id);
    socket.on('create-game', createGame);
    socket.on('join-game', joinGame);

    function createGame(data){
        var playerName = data.name;
        var size = data.size;
        var room = generateRoomID();
        var players = []
        players.push({name: playerName});
        socket.join(room);
        rooms[room] = {id: room, players:players, size:size};
        io.sockets.in(room).emit('game-pending', rooms[room]);
    }
    function joinGame(data){
        var playerName = data.name;
        var room = data.room;
        if(rooms[room] == undefined){
            io.sockets.in(socket.id).emit('invalid-room');
            return;
        }
        socket.join(room);
        rooms[room].players.push({name: playerName});
        io.sockets.in(room).emit('game-pending', rooms[room]);

    }
}

function generateRoomID(){
    return Math.floor(Math.random() * 1000000000)
}