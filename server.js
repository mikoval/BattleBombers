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
var radius = 0.5;
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
            var grid = createGrid(9 + 2 * players.length,9 + 2 * players.length)
            room.game = {grid: grid,  startTime: new Date(), currentTime: 0 }
            for(var i = 0; i < players.length; i++){
                var location;
                if (i == 0){location = {x: 1.5, y :1.5}}
                else if (i == 1){location = {x: grid.length - 1.5, y : grid[0].length - 1.5}}
                else if (i == 2){location = {x: 1.5, y : grid[0].length - 1.5}}
                else if (i == 3){location = {x: grid.length - 1.5, y : 1.5}}
                players[i].position = location;
                players[i].direction = {up: false, down: false, left: false, right: false, bomb: false};
                players[i].bombCount = 0;
                players[i].bombMax = 1;
                players[i].lives = 3;
                players[i].invulnerable = -1;
                players[i].speed = 0.05;
                players[i].dir = "front";
                players[i].moving = false;
                
            }
            active.push(roomid);
            io.sockets.in(roomid).volatile.emit('game-start', room);
        }
        else{
            io.sockets.in(roomid).volatile.emit('game-pending', room);
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
            //bottom right
            if((i == width-2 && j == height-2) || (i == width-2 && j == height-3) || (i == width-3 && j == height-2)) {continue}

            //top left
            if((i == 1 && j == 1) || (i ==1 && j ==2) || (i == 2 && j == 1)) {continue;}

            //top right
            if((i == 1 && j == height-2) || (i ==1 && j == height-3) || (i == 2 && j == height-2)) {continue;}

            //bottom left
            if((i ==  width-2 && j ==1) || (i ==width-3 && j ==  1) || (i == width-2 && j == 2)) {continue;}


            if(Math.random() < .8 && !arr[i][j].wall){
                var rand = Math.random();
                arr[i][j].box = true;
                if(rand < 0.08)
                    arr[i][j].boots = true;
                else if (rand < 0.14)
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
                    grid[x][y].bomb.timer -= 0.035;
                    if(grid[x][y].bomb.timer <= 0 || grid[x][y].fireTimer >= 0){
                        if(grid[x][y].bomb.player)
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

        io.sockets.in(active[i]).volatile.emit('game-update', compress(room));
    }


 
}
function canMove(nx, ny, x, y, grid){
    var onBomb = [];

    var current0 = grid[Math.floor(x)][Math.floor(y)]
    var current1 = grid[Math.floor(x+ radius * 0.9)][Math.floor(y)]
    var current2 = grid[Math.floor(x- radius * 0.9)][Math.floor(y)]
    var current3 = grid[Math.floor(x)][Math.floor(y+ radius * 0.9)]
    var current4 = grid[Math.floor(x)][Math.floor(y- radius * 0.9)]
    if(current0.bomb){
        onBomb.push( current0);
    }
    if(current1.bomb){
        onBomb.push( current1);
    }
    if(current2.bomb){
        onBomb.push( current2);
    }
    if(current3.bomb){
        onBomb.push( current3);
    }
    if(current4.bomb){
        onBomb.push( current4);
    }
    

    var cell1 = grid[Math.floor(nx + radius * 0.9)][Math.floor(ny)]
    var cell2 = grid[Math.floor(nx - radius * 0.9)][Math.floor(ny)]
    var cell3 = grid[Math.floor(nx)][Math.floor(ny + radius * 0.9)]
    var cell4 = grid[Math.floor(nx)][Math.floor(ny - radius * 0.9)]
    var current = false

    if(cell1.wall || cell1.box || ( (cell1.bomb && onBomb.length == 0)  || (cell1.bomb && !containsObject(cell1, onBomb))) ){
        return false;
    }
    if(cell2.wall || cell2.box ||  ( (cell2.bomb && onBomb.length == 0)  || (cell2.bomb && !containsObject(cell2, onBomb)))  ){
        return false;
    }
    if(cell3.wall || cell3.box ||  ( (cell3.bomb && onBomb.length == 0)  || (cell3.bomb && !containsObject(cell3, onBomb)))  ){
        return false;
    }
    if(cell4.wall || cell4.box ||  ( (cell4.bomb && onBomb.length == 0)  || (cell4.bomb && !containsObject(cell4, onBomb)))  ){
        return false;
    }
    
    return true;
}
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}
function distance(c1, c2){
    return Math.pow(Math.pow((c1.x - c2.x),2) + Math.pow((c1.y - c2.y),2) , 0.5);
}
function updatePosition(){
    for(var i = 0; i < active.length; i++){
        var room = rooms[active[i]]
        var players = room.players
        var grid = room.game.grid;
        var time = (new Date()) - room.game.startTime ;
        room.game.currentTime = time;
        var timer = time /1000
        if(timer < 3){continue;}
        timer  = timer / 60
        if(timer > 4){
            addBomb(grid, (timer -4 ) /10 + 1);
        }
        var alivePlayers = 0
        for(var j = 0; j < players.length; j++){
            
            var player = players[j]
            if(player.lives <= 0){ continue;}
            alivePlayers += 1;
            var position = player.position;
            var direction = player.direction;
            var x = Math.floor(position.x);
            var y = Math.floor(position.y);
            if(grid[x][y].boots){
                player.speed += 0.02;
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
                io.sockets.in(active[i]).volatile.emit('score-update', compress(room));
            }
            if(direction.up){
                player.moving = true;
                player.dir = "back"
                var cx = position.x - Math.floor(position.x)
                if(cx!= 0.5){
                    if(cx < 0.5){
                        if(cx + player.speed > 0.6){
                            position.x = position.x + (0.5 - cx);
                        }
                        else{
                            position.x = position.x +  player.speed;
                        }
                    }
                    else{
                        if(cx - player.speed < 0.5){
                            position.x = position.x - (cx- 0.5);
                        }
                        else{
                            position.x = position.x - player.speed;
                        }
                    }
                }
                else{
                    var ny = position.y -player.speed;
                    var nx = position.x;
                    if(canMove(nx, ny ,  x ,y, grid))
                        position.y = position.y - player.speed
                }
                
            }
            else if(direction.down){
                player.moving = true;
                player.dir = "front"
                var cx = position.x - Math.floor(position.x)

                if(cx!= 0.5){
                    if(cx < 0.5){
                        if(cx + player.speed > 0.5){
                            position.x = position.x + (0.5 - cx);
                        }
                        else{
                            position.x = position.x +  player.speed;
                        }
                    }
                    else{
                        if(cx - player.speed < 0.5){
                            position.x = position.x - (cx- 0.5);
                        }
                        else{
                            position.x = position.x - player.speed;
                        }
                    }
                }
                else{
                    var ny = position.y + player.speed;
                    var nx = position.x;
                    if(canMove(nx, ny ,  x ,y, grid))
                        position.y = position.y + player.speed
                }
            }
            else if(direction.right){
                player.moving = true;
                player.dir = "right"
                var cy = position.y - Math.floor(position.y)

                if(cy!= 0.5){
                    if(cy < 0.5){
                        if(cy + player.speed > 0.5){
                            position.y = position.y + (0.5 - cy);
                        }
                        else{
                            position.y = position.y +  player.speed;
                        }
                    }
                    else{
                        if(cy - player.speed < 0.5){
                            position.y = position.y - (cy- 0.5);
                        }
                        else{
                            position.y = position.y - player.speed;
                        }
                    }
                }
                else{
                    var ny = position.y ;
                    var nx = position.x + player.speed;
                    if(canMove(nx, ny ,  x ,y, grid))
                        position.x = position.x + player.speed
                }
            }
            else if(direction.left){
                player.moving = true;
                player.dir = "left"
                var cy = position.y - Math.floor(position.y)
                if(cy!= 0.5){
                    if(cy < 0.5){
                        if(cy + player.speed > 0.5){
                            position.y = position.y + (0.5 - cy);
                        }
                        else{
                            position.y = position.y +  player.speed;
                        }
                    }
                    else{
                        if(cy - player.speed < 0.5){
                            position.y = position.y - (cy- 0.5);
                        }
                        else{
                            position.y = position.y - player.speed;
                        }
                    }
                }
                else{
                    var ny = position.y ;
                    var nx = position.x - player.speed;
                    if(canMove(nx, ny ,  x ,y, grid))
                        position.x = position.x - player.speed
                }
            }
            else{
                player.moving = false;
            }
            if(direction.bomb){
                if(player.bombCount < player.bombMax  &&  grid[Math.floor(position.x)][Math.floor(position.y)].bomb == undefined){
                    grid[Math.floor(position.x)][Math.floor(position.y)].bomb = {player: player, timer: 1, active: true}
                    player.bombCount +=1;
                }
            }

        }
        
        if(alivePlayers <= 1){

            var winner = undefined;
            for(var j = 0; j < players.length; j++){
                if(players[j].lives >= 1){
                    winner = players[j].name;
                }
            }
            setTimeout(function(i){

                active.splice(i, 1);
                }, 0, i)
            var code = generateRoomID();
            var data = {winner: winner, newRoom: code}
            rooms[code] = {id: code, players:[], size:players.length};

            io.sockets.in(active[i]).volatile.emit('game-over', data);
        }

        else{
            var send = compress(room);
            io.sockets.in(active[i]).volatile.emit('game-update', send);
        }
        
    }

}
function compress(game){
    var grid = game.game.grid;
    var players = game.players;
    var time = game.game.currentTime;

    var minGrid = createGrid(grid.length, grid[0].length);
    var minPlayers = new Array(players.length);
    for( var i = 0; i < players.length; i++){
        minPlayers[i] = {position: players[i].position, lives: players[i].lives, direction:players[i].dir, moving: players[i].moving }
    }
    for( var i = 0; i < grid.length; i++){
        for( var j = 0; j < grid[0].length; j++){
            minGrid[i][j] = {}
            if(grid[i][j].fireTimer >= 0){minGrid[i][j].floor = "fire"}
            else if(grid[i][j].wall)    {minGrid[i][j].floor = "wall"}
            else if(grid[i][j].box)     {minGrid[i][j].floor = "box"}
            else                        {minGrid[i][j].floor = "_"}

            if(grid[i][j].bomb){minGrid[i][j].obj = "bomb"}
    
            else if(!grid[i][j].box && grid[i][j].bombP){minGrid[i][j].obj = "bomb-boost"}
            else if(!grid[i][j].box && grid[i][j].boots){minGrid[i][j].obj = "speed-boost"}
            else {minGrid[i][j].obj = ""}
        }
    }
    return {grid: minGrid, players: minPlayers, time: time};

}

function addBomb(grid, timer){
    var prob = Math.random();
    if(prob > Math.log(timer) ) { return;}
    var x = Math.floor(Math.random()*grid.length);
    var y = Math.floor(Math.random()* grid[0].length);
    if(grid[x][y].bomb || grid[x][y].wall || grid[x][y].box || grid[x][y].boots ||  grid[x][y].bombP){
        addBomb(grid);
    }
    else{
        grid[x][y].bomb = {player: undefined, timer: 1, active: true}
    }
}