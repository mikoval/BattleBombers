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
app.get('/:room', function (req, res) {
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
        active = [];
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
            room.game = {grid: createGrid(17,17) }
            for(var i = 0; i < players.length; i++){
                var location;
                if (i == 0){location = {x: 1.5, y :1.5}}
                else if (i == 1){location = {x: 15.5, y : 15.5}}
                else if (i == 2){location = {x: 1.5, y : 15.5}}
                else if (i == 3){location = {x: 15.5, y : 1.5}}
                players[i].position = location;
                players[i].direction = {up: false, down: false, left: false, right: false, bomb: false};
                players[i].bombCount = 0;
                players[i].bombMax = 2;
                players[i].lives = 3;
                players[i].invulnerable = -1;
                
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
        if(room==undefined){return;}
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
            if(i == 0 || i == width-1 || j == 0 || j == height-1 || (i%2 == 0) && (j%2 == 0)){
                arr[i].push({wall : true, fireTimer: -1, box: false})
            }
            else{
                arr[i].push({fireTimer: -1, box:false});
            }
            
        }
    }
    for(var i = 1; i < width-1; i++)
    {   
        for(var j = 1; j < height -1; j++){
            if((i == width-2 && j == height-2) || (i == width-2 && j == height-3) || (i == width-3 && j == height-2)) {continue}
            if((i == 1 && j == 1) || (i ==1 && j ==2) || (i == 2 && j == 1)) {continue;}
            if(Math.random() < .8 && !arr[i][j].wall){
                arr[i][j].box = true;
            }
            
        }
    }
    return arr;
}
setInterval(updatePosition, 30)
setInterval(updateBombs, 100)

function updateBombs(){

    for(var i = 0; i < active.length; i++){
        var room = rooms[active[i]]
        var players = room.players
        var grid = room.game.grid;
        for(var x = 0; x  < grid.length; x++){
            for(var y = 0; y < grid[0].length; y++){
                if(grid[x][y].fireTimer >= 0){
                    grid[x][y].fireTimer -= .2;
                }
                
            }
        }
        for(var x = 0; x  < grid.length; x++){
            for(var y = 0; y < grid[0].length; y++){
                 if(grid[x][y].bomb != undefined){
                    grid[x][y].bomb.timer -= 0.05;
                    if(grid[x][y].bomb.timer <= 0 || grid[x][y].fireTimer >= 0){
                        grid[x][y].bomb.player.bombCount -= 1;
                        grid[x][y].bomb = undefined;
                        for(var k = 0; k < 3; k++){
                            if(grid[x + k][y].box)
                            {
                                grid[x + k][y].box = false;
                                break;
                            }
                            if(grid[x + k][y].wall)
                                break; 
                            grid[x+k][y].fireTimer = 1;  
                        }
                        for(var k = 0; k < 3; k++){
                            if(grid[x - k][y].box)
                            {
                                grid[x - k][y].box = false;
                                break;
                            }
                            if(grid[x - k][y].wall)
                                break; 
                            grid[x-k][y].fireTimer = 1;  
                        }
                        for(var k = 0; k < 3; k++){
                            if(grid[x ][y+ k].box)
                            {
                                grid[x ][y + k].box = false;
                                break;
                            }
                            if(grid[x][y + k].wall)
                                break; 
                            grid[x][y + k].fireTimer = 1;  
                        }
                        for(var k = 0; k < 3; k++){
                            if(grid[x ][y -k].box)
                            {
                                grid[x][y-k].box = false;
                                break
                            }
                            if(grid[x][y -k].wall)
                                break; 
                            grid[x][y-k].fireTimer = 1;  
                        }

                       
                    }
                    
                }
                
            }
        }

        io.sockets.in(active[i]).emit('game-update', room);
    }
    

 
}
function updatePosition(){
    for(var i = 0; i < active.length; i++){
        var room = rooms[active[i]]
        var players = room.players
        var grid = room.game.grid;
        for(var j = 0; j < players.length; j++){
           
            var player = players[j]
            var position = player.position;
            var direction = player.direction;
            var x = Math.floor(position.x);
            var y = Math.floor(position.y);

            if(player.invulnerable >= 0){ player.invulnerable -= 0.01;}
            if(grid[Math.floor(position.x)][Math.floor(position.y)].fireTimer >= 0 && player.invulnerable < 0){
                player.lives -= 1;
                
                player.invulnerable = 1;
                io.sockets.in(active[i]).emit('score-update', room);
            }
            if(direction.up){
                var ny = Math.floor(position.y -.1);
                var nx = Math.floor(position.x);
                if(!grid[nx][ny].wall && !grid[nx][ny].box && !(grid[nx][ny].bomb && !grid[x][y].bomb))
                    position.y = position.y - .1
            }
            if(direction.down){
                var ny = Math.floor(position.y +.1);
                var nx = Math.floor(position.x);
                if(!grid[nx][ny].wall && !grid[nx][ny].box && !(grid[nx][ny].bomb && !grid[x][y].bomb))
                    position.y = position.y + .1
            }
            if(direction.right){
                var ny = Math.floor(position.y);
                var nx = Math.floor(position.x + .1);
                if(!grid[nx][ny].wall && !grid[nx][ny].box && !(grid[nx][ny].bomb && !grid[x][y].bomb))
                    position.x = position.x + .1
            }
            if(direction.left){
                var ny = Math.floor(position.y);
                var nx = Math.floor(position.x -.1);
                if(!grid[nx][ny].wall && !grid[nx][ny].box && !(grid[nx][ny].bomb && !grid[x][y].bomb))
                    position.x = position.x  - .1
            }
            if(direction.bomb){
                if(player.bombCount < player.bombMax  &&  grid[Math.floor(position.x)][Math.floor(position.y)].bomb == undefined){
                    grid[Math.floor(position.x)][Math.floor(position.y)].bomb = {player: player, timer: 1, active: true}
                    player.bombCount +=1;
                }
            }
        }
        
        io.sockets.in(active[i]).emit('game-update', room);
    }
}