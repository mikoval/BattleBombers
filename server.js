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
var rooms = {};
var active = [];
function newConnection(socket){
    console.log("new socket connection: " + socket.id);
    socket.on('create-game', createGame);
    socket.on('join-game', joinGame);
    socket.on('update-input', updateInput)

    function createGame(data){
        var playerName = data.name;
        var size = data.size;
        var room = generateRoomID();
        var players = []
        players.push({name: playerName, id:socket.id});
        socket.room = room;
        socket.join(room);
        rooms[room] = {id: room, players:players, size:size};
        io.sockets.in(room).emit('game-pending', rooms[room]);
    }
    function joinGame(data){
        var playerName = data.name;
        var roomid = data.room;
        var players = rooms[roomid].players
        
        if(rooms[roomid] == undefined || players.length >= rooms[roomid].size){
            io.sockets.in(socket.id).emit('invalid-room');
            return;
        }
        socket.room = roomid;
        socket.join(roomid);
        var room = rooms[roomid]
        players.push({name: playerName, id:socket.id});
        if(players.length == room.size){
            room.game = {grid: createGrid(16,16) }
            for(var i = 0; i < players.length; i++){
                var location;
                if (i == 0){location = {x: 1.5, y :1.5}}
                else if (i == 1){location = {x: 13.5, y : 13.5}}
                else if (i == 2){location = {x: 1.5, y : 13.5}}
                else if (i == 3){location = {x: 13.5, y : 1.5}}
                players[i].position = location;
                players[i].direction = {up: false, down: false, left: false, right: false, bomb: false};
                players[i].bombCount = 0;
                players[i].bombMax = 2;
                
            }
            active.push(roomid);
            io.sockets.in(roomid).emit('game-start', room);
        }
        else{
            io.sockets.in(roomid).emit('game-pending', room);
        }
        

    }
    function updateInput(data){
        var roomnum = socket.room;
        var room = rooms[roomnum];
        var players = room.players;
        for(var i = 0; i < players.length; i++){
            if(players[i].id == socket.id){
                players[i].direction = data;
            }
        }
    }
}

function generateRoomID(){
    return Math.floor(Math.random() * 1000000000)
}
function createGrid(width, height){
    var arr = []
    for(var i = 0; i < width; i++)
    {   
        arr.push([])
        for(var j = 0; j < height; j++){
            if(i == 0 || i == width-1 || j == 0 || j == height-1){
                arr[i].push({wall : true, fireTimer: -1})
            }
            else{
                arr[i].push({fireTimer: -1});
            }
            
        }
    }
    return arr;
}
setInterval(updateGames, 30)

function updateGames(){
    for(var i = 0; i < active.length; i++){
        var room = rooms[active[i]]
        var players = room.players
        var grid = room.game.grid;
        for(var j = 0; j < players.length; j++){
            var player = players[j]
            var position = player.position;
            var direction = player.direction;
            if(direction.up){
                var ny = Math.floor(position.y -.1);
                var nx = Math.floor(position.x);
                if(!grid[nx][ny].wall)
                    position.y = position.y - .1
            }
            if(direction.down){
                var ny = Math.floor(position.y +.1);
                var nx = Math.floor(position.x);
                if(!grid[nx][ny].wall)
                    position.y = position.y + .1
            }
            if(direction.right){
                var ny = Math.floor(position.y);
                var nx = Math.floor(position.x + .1);
                if(!grid[nx][ny].wall)
                    position.x = position.x + .1
            }
            if(direction.left){
                var ny = Math.floor(position.y);
                var nx = Math.floor(position.x -.1);
                if(!grid[nx][ny].wall)
                    position.x = position.x  - .1
            }
            if(direction.bomb){
                if(player.bombCount < player.bombMax  &&  grid[Math.floor(position.x)][Math.floor(position.y)].bomb == undefined){
                    grid[Math.floor(position.x)][Math.floor(position.y)].bomb = {player: player, timer: 1, active: true}
                    player.bombCount +=1;
                }
            }
        }
        for(var x = 0; x  < grid.length; x++){
            for(var y = 0; y < grid[0].length; y++){
                if(grid[x][y].bomb != undefined){
                    grid[x][y].bomb.timer -= 0.02;
                    if(grid[x][y].bomb.timer <= 0 || grid[x][y].fireTimer > 0){
                        grid[x][y].bomb.player.bombCount -= 1;
                        grid[x][y].bomb = undefined;
                        for(var k = 0; k < 3; k++){
                            if(grid.length  > x + k) 
                                grid[x+k][y].fireTimer = 1;
                            if(0 <= x- k) 
                                grid[x-k][y].fireTimer = 1;
                            if(grid[0].length  > y + k) 
                                grid[x][y+k].fireTimer = 1;
                            if(0 <= y- k) 
                                grid[x][y-k].fireTimer = 1;
                        }

                    }
                }
                if(grid[x][y].fireTimer > 0){
                    grid[x][y].fireTimer -= 0.1;
                }
            }
        }
        io.sockets.in(active[i]).emit('game-update', room);
    }
    
}