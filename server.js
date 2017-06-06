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
var radius = 0.3;
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
            room.game = {grid: createGrid(13,13) }
            for(var i = 0; i < players.length; i++){
                var location;
                if (i == 0){location = {x: 1.5, y :1.5}}
                else if (i == 1){location = {x: 11.5, y : 11.5}}
                else if (i == 2){location = {x: 1.5, y : 11.5}}
                else if (i == 3){location = {x: 11.5, y : 1.5}}
                players[i].position = location;
                players[i].direction = {up: false, down: false, left: false, right: false, bomb: false};
                players[i].bombCount = 0;
                players[i].bombMax = 1;
                players[i].lives = 3;
                players[i].invulnerable = -1;
                players[i].speed = 0.1;
                
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
                arr[i].push({wall : true, fireTimer: -1, box: false,  center : {x: i + 0.5, y: j+0.5}, innerRadius: 1, outerRadius:  1.4142})
            }
            else{
                arr[i].push({fireTimer: -1, box:false,  center : {x: i + 0.5, y: j+0.5}, innerRadius: 1, outerRadius:  1.4142});
            }

            
        }
    }
    for(var i = 1; i < width-1; i++)
    {   
        for(var j = 1; j < height -1; j++){
            if((i == width-2 && j == height-2) || (i == width-2 && j == height-3) || (i == width-3 && j == height-2)) {continue}
            if((i == 1 && j == 1) || (i ==1 && j ==2) || (i == 2 && j == 1)) {continue;}
            if(Math.random() < .4 && !arr[i][j].wall){
                var rand = Math.random();
                arr[i][j].box = true;
                if(rand < 0.1)
                    arr[i][j].boots = true;
                else if (rand < 0.2)
                    arr[i][j].bombP = true;
            }
            
        }
    }
    return arr;
}
setInterval(updatePosition, 20)
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
function canMove(nx, ny, x, y, grid){
    var valid = true;
    var onBomb = false;
    if(checkBomb(x-1, y-1, x, y, grid, onBomb)) { onBomb = true;}
    if(checkBomb(x, y-1 , x, y, grid, onBomb)) { onBomb = true;}
    if(checkBomb(x+1, y-1 , x, y, grid, onBomb)) { onBomb = true;}

    if(checkBomb(x-1, y , x, y, grid, onBomb)) { onBomb = true;}
    if(checkBomb(x,  y ,x, y, grid, onBomb)) { onBomb = true;}
    if(checkBomb(x+1, y , x, y, grid, onBomb)) { onBomb = true;}

    if(checkBomb(x-1, y+1 , x, y, grid, onBomb)) { onBomb = true;}
    if(checkBomb(x, y+1 , x, y, grid, onBomb)) { onBomb = true;}
    if(checkBomb(x+1, y+1 , x, y, grid, onBomb)) { onBomb = true;}


    //

    if(!checkBox(nx-1, ny-1, nx, ny, grid, onBomb)) { valid = false;}
    if(!checkBox(nx, ny-1 , nx, ny, grid, onBomb)) { valid = false;}
    if(!checkBox(nx+1, ny-1 , nx, ny, grid, onBomb)) { valid = false;}

    if(!checkBox(nx-1, ny , nx, ny, grid, onBomb)) { valid = false;}
    if(!checkBox(nx,  ny , nx, ny, grid, onBomb)) { valid = false;}
    if(!checkBox(nx+1, ny , nx, ny, grid, onBomb)) { valid = false;}

    if(!checkBox(nx-1, ny+1 , nx, ny, grid, onBomb)) { valid = false;}
    if(!checkBox(nx, ny+1 , nx, ny, grid, onBomb)) { valid = false;}
    if(!checkBox(nx+1, ny+1 , nx, ny, grid, onBomb)) { valid = false;}
    
    return valid;
}
function checkBomb(x,y, nx, ny, grid, onBomb){
    var center1 = grid[Math.floor(x)][Math.floor(y)].center
    var center2 = {x: nx, y:ny};
    var pt = {x: center2.x, y : center2.y};
    var bomb = grid[Math.floor(x)][Math.floor(y)].bomb
    if(pt.x > center1.x + .5) pt.x = center1.x  + 0.5;
    if(pt.x < center1.x - 0.5) pt.x = center1.x - 0.5;
    if(pt.y > center1.y + .5) pt.y = center1.y + .5;
    if(pt.y < center1.y - .5) pt.y = center1.y - .5;


    //distance check, just use distance^2 for actual implementation

    if(distance(pt, center2) < radius && bomb ) {

        return true;
    }

    return false; 
}
function checkBox(x,y, nx, ny, grid, onBomb){

    var center1 = grid[Math.floor(x)][Math.floor(y)].center
    var center2 = {x: nx, y:ny};
    var wall = grid[Math.floor(x)][Math.floor(y)].wall
    var box = grid[Math.floor(x)][Math.floor(y)].box
    var bomb = grid[Math.floor(x)][Math.floor(y)].bomb

    var pt = {x: center2.x, y : center2.y};
    if(pt.x > center1.x + .5) pt.x = center1.x  + 0.5;
    if(pt.x < center1.x - 0.5) pt.x = center1.x - 0.5;
    if(pt.y > center1.y + .5) pt.y = center1.y + .5;
    if(pt.y < center1.y - .5) pt.y = center1.y - .5;


    //distance check, just use distance^2 for actual implementation

    if(distance(pt, center2) < radius && ((wall||box) ||  (bomb && !onBomb))   ) {

        return false;
    }

    return true; 
}
function distance(c1, c2){
    return Math.pow(Math.pow((c1.x - c2.x),2) + Math.pow((c1.y - c2.y),2) , 0.5);
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
            if(grid[x][y].boots){
                player.speed += 0.01;
                if(player.speed > 2){
                    player.speed = 2;
                }
                grid[x][y].boots = false;
            }
            if(grid[x][y].bombP){
                player.bombMax += 1;
                grid[x][y].bombP = false;
            }

            x = position.x;
            y = position.y;


            if(player.invulnerable >= 0){ player.invulnerable -= 0.01;}
            if(grid[Math.floor(position.x)][Math.floor(position.y)].fireTimer >= 0 && player.invulnerable < 0){
                player.lives -= 1;
                
                player.invulnerable = 1;
                io.sockets.in(active[i]).emit('score-update', room);
            }
            if(direction.up){

                var ny = position.y -player.speed;
                var nx = position.x;
                if(canMove(nx, ny ,  x ,y, grid))
                    position.y = position.y - player.speed
            }
            if(direction.down){
                var ny = position.y +player.speed;
                var nx = position.x;
                if(canMove(nx, ny ,  x ,y , grid))
                    position.y = position.y + player.speed
            }
            if(direction.right){
                var ny = position.y;
                var nx = position.x + player.speed;
                if(canMove(nx, ny ,  x ,y , grid))
                    position.x = position.x + player.speed
            }
            if(direction.left){
                var ny = position.y;
                var nx = position.x -player.speed;
                if(canMove(nx, ny ,  x ,y , grid))
                    position.x = position.x  - player.speed
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