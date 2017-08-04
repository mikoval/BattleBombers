var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var characterModule = require('./character_module.js');
var boardModule = require('./board_module.js');
var gameModule = require('./game_module.js');


var server = app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
  res.render('index.ejs')
})
app.get('/:room', function (req, res) {
  res.render('index.ejs')
})


var socket = require('socket.io');

var io = socket(server);


io.sockets.on('connection', newConnection);
var rooms = {};
var active = [];

function newConnection(socket){
    console.log("new socket connection: " + socket.id);
    socket.on('create-game', createGame);
    socket.on('join-game', joinGame);
    socket.on('start-room', startGame);
    socket.on('update-input', updateInput);
    socket.on('character-update', updateCharacter);
    socket.on('disconnect', function () {
        if(socket.room){
            var room = rooms[socket.room];
            if(room.game != undefined)
                return;
            for(var i = 0; i < room.players.length; i++){
                if(room.players[i].id == socket.id){
                    room.players.splice(i,1);
                    break;
                }
            }
            waitingRoom(socket.room, room);

        }
        
    });
    socket.on('leave-room', function () {
        if(socket.room){
            var room = rooms[socket.room];
            for(var i = 0; i < room.players.length; i++){
                if(room.players[i].id == socket.id){
                    room.players.splice(i,1);
                    break;
                }
            }
            socket.leave(socket.room);
            waitingRoom(socket.room, room);


        }
        
    });
    function updateCharacter(data){
        var roomid = socket.room;
        var players = rooms[roomid].players
        for(var i = 0; i < players.length; i++){
            if(players[i].id == socket.id){
                players[i].sprite = data;
                break;
            }
        }
        waitingRoom(socket.room, rooms[roomid]);

    }
    function startGame(data){
        var roomid = socket.room;
        var room = rooms[roomid];
        var players = room.players;
        var grid = boardModule.loadMap(9 + 2 * players.length,9 + 2 * players.length, room.type);

        
        
        for(var i = 0; i < players.length; i++){
            var location;
            if (i == 0){location = {x: 1.5, y :1.5}}
            else if (i == 1){location = {x: grid.length - 1.5, y : grid[0].length - 1.5}}
            else if (i == 2){location = {x: 1.5, y : grid[0].length - 1.5}}
            else if (i == 3){location = {x: grid.length - 1.5, y : 1.5}}

            players[i].direction =  {up: false, down: false, left: false, right: false, bomb: false, glue:false,mine:false,};
            players[i].character = characterModule.loadCharacter(players[i].sprite, location.x, location.y);
           
        }
        room.game = gameModule.load( players, grid, room.type);
        active.push(roomid);
        var send = room.game.compress();
        var data = {grid: room.game.grid, players: send.p, enemies: send.e};
        io.sockets.in(roomid).emit('game-start', data);
    }
    
    function createGame(data){
        var playerName = data.name;
        var type = data.type;

        if ( (playerName.trim()) == '' )
            playerName = "Player " + (1)
        var room = generateRoomID();
        var players = []
        players.push({name: playerName, id:socket.id, sprite:"fox"});
        socket.room = room;
        socket.join(room);
        rooms[room] = {id: room, players:players, type : type };

        waitingRoom(socket.room, room);
    }
    function joinGame(data){
        var playerName = data.name;
        var roomid = data.room;

        if(rooms[roomid] == undefined || rooms[roomid].game != undefined){
            io.sockets.in(socket.id).emit('invalid-room');
            return;
        }
        var players = rooms[roomid].players

        if ( (playerName.trim()) == '' ){
            playerName = "Player " + (players.length+ 1)
        }
            

        if(players.length >= 4){
            io.sockets.in(socket.id).emit('invalid-room');
            return;
        }
        socket.room = roomid;
        socket.join(roomid);
        var room = rooms[roomid]
        var character = characterModule.getValidCharacter(players);
        players.push({name: playerName, id:socket.id, sprite:character});
        
        
        waitingRoom(socket.room, room);
        
        

    }
    function updateInput(data){
        var roomnum = socket.room;
        var room = rooms[roomnum];
        if(room==undefined){return;}
        var players = room.players;
        for(var i = 0; i < players.length; i++){
            if(players[i].id == socket.id){
                if(players[i].direction){
                    var bomb = players[i].direction.bomb;
                    var glue = players[i].direction.glue;
                    var mine = players[i].direction.mine;

                    players[i].direction = data;
                    if(!players[i].direction.bomb && bomb)
                        players[i].direction.bomb = bomb;
                    if(!players[i].direction.glue && glue)
                        players[i].direction.glue = glue;

                    if(!players[i].direction.mine && mine)
                        players[i].direction.mine = mine;

                    
                     
                    
                }

                
            }
        }
    }
}

function generateRoomID(){
    return Math.floor(Math.random() * 1000000000)
}


setInterval(updateGames, 20)
function updateGames(){

	for(var i = 0; i < active.length; i++){
		var room = rooms[active[i]];
		room.game.update();
		var send = room.game.compress();
        io.sockets.in(active[i]).volatile.emit('game-update', send);
        if(!room.game.active()){
        	var winner = room.game.winner();
            setTimeout(function(i){

                active.splice(i, 1);
                }, 0, i)
            var code = generateRoomID();
            var data = {winner: winner, newRoom: code}
            rooms[code] = {id: code, players:[],  type: room.type};

            io.sockets.in(active[i]).emit('game-over', data);
        }

	}
}






function waitingRoom(id){
    if(rooms[id].players.length > 0){
        var s =  io.sockets.connected[rooms[id].players[0].id];

        var data = {room:rooms[id], leader:false}
        s.broadcast.to(id).emit('game-pending', data);
        data.leader = true;
        s.emit('game-pending', data);
    }
        

}
