 var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var chars = require('./character_module.js');

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
                players[i].character = data;
                break;
            }
        }
        waitingRoom(socket.room, rooms[roomid]);

    }
    function startGame(data){
        var roomid = socket.room;
        var players = rooms[roomid].players
        var room = rooms[roomid]
        var grid = createGameBoard(9 + 2 * players.length,9 + 2 * players.length);
        while(!validGrid(grid)){
            console.log("invalid");
            grid = createGameBoard(9 + 2 * players.length,9 + 2 * players.length);
        }
        room.game = {grid: grid,  startTime: new Date(), currentTime: 0 }
        for(var i = 0; i < players.length; i++){
            var location;
            if (i == 0){location = {x: 1.5, y :1.5}}
            else if (i == 1){location = {x: grid.length - 1.5, y : grid[0].length - 1.5}}
            else if (i == 2){location = {x: 1.5, y : grid[0].length - 1.5}}
            else if (i == 3){location = {x: grid.length - 1.5, y : 1.5}}
            players[i].position = location;
            players[i].direction = {up: false, down: false, left: false, right: false, bomb: false, glue:false,};
            players[i].bombCount = 0;
            players[i].lives = 3;
            players[i].invulnerable = -1;
            players[i].dir = "front";
            players[i].moving = false;
            players[i].ghost = -1.0;
            players[i].glue = 0;

            var stats = chars.getCharacterStats(players[i].character);
            players[i].bombStrength = stats.bombStrength;
            players[i].bombMax = stats.bombMax;
            players[i].speed = stats.speed;
            
        }
        active.push(roomid);

        io.sockets.in(roomid).volatile.emit('game-start', room);
    }
    
    function createGame(data){
        var playerName = data.name;

        if ( (playerName.trim()) == '' )
            playerName = "Player " + (1)
        var room = generateRoomID();
        var players = []
        players.push({name: playerName, id:socket.id, character:"fox"});
        socket.room = room;
        socket.join(room);
        rooms[room] = {id: room, players:players };
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
        var character = chars.getValidCharacter(players);
        players.push({name: playerName, id:socket.id, character:character});
        
        
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

                    players[i].direction = data;
                    if(!players[i].direction.bomb && bomb)
                        players[i].direction.bomb = bomb;
                    if(!players[i].direction.glue && glue)
                        players[i].direction.glue = glue;

                    
                     
                    
                }

                
            }
        }
    }
}

function generateRoomID(){
    return Math.floor(Math.random() * 1000000000)
}

function createGameBoard(width,height){
     var type = Math.floor(Math.random()*3);
    console.log(type);
    var arr = [];

    for(var i = 0; i < width; i++)
    {   
        arr.push([])
        for(var j = 0; j < height; j++){
            if(i == 0 || i == width-1 || j == 0 || j == height-1 ) {
                arr[i].push({wall : true, fireTimer: -1, box: false,  center : {x: i + 0.5, y: j+0.5}, innerRadius: 1, outerRadius:  1.4142})
            }
            else{
                arr[i].push({fireTimer: -1, box:false,  center : {x: i + 0.5, y: j+0.5}, innerRadius: 1, outerRadius:  1.4142});
            }

            
        }
    }

    if(type == 0){
        for(var i = 1; i < width-1; i++)
        {   
            for(var j = 1; j < height -1; j++){
                if( i %2 ==  0 && j %2 == 0 ){
                    arr[i][j].wall = true;
                }
                //bottom right
                if((i == width-2 && j == height-2) || (i == width-2 && j == height-3) || (i == width-3 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top left
                if((i == 1 && j == 1) || (i ==1 && j ==2) || (i == 2 && j == 1)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top right
                if((i == 1 && j == height-2) || (i ==1 && j == height-3) || (i == 2 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //bottom left
                if((i ==  width-2 && j ==1) || (i ==width-3 && j ==  1) || (i == width-2 && j == 2)) {
                    arr[i][j].wall = false;
                    continue;
                }
                
                if(Math.random() < .8 && !arr[i][j].wall){
                    var rand = Math.random();
                    arr[i][j].box = true;
                    if(rand < 0.02)
                        arr[i][j].lifeP = true;
                    else if(rand < 0.07)
                        arr[i][j].boots = true;
                    else if (rand < 0.15)
                        arr[i][j].bombP = true;
                    else if (rand < 0.20)
                        arr[i][j].bombS = true;
                    else if(rand < 0.25)
                        arr[i][j].ghost = true;
                    else if(rand < 0.30)
                        arr[i][j].glueP = true;
                }
            }
        }
    }
       
    else if(type == 1){
        
        for(var i = 1; i < width-1; i++)
        {   
            for(var j = 1; j < height -1; j++){
                if(Math.round(Math.random()*10)%4 == 0){
                    arr[i][j] = {wall : true, fireTimer: -1, box: false,  center : {x: i + 0.5, y: j+0.5}, innerRadius: 1, outerRadius:  1.4142}
                }

               //bottom right
                if((i == width-2 && j == height-2) || (i == width-2 && j == height-3) || (i == width-3 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top left
                if((i == 1 && j == 1) || (i ==1 && j ==2) || (i == 2 && j == 1)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top right
                if((i == 1 && j == height-2) || (i ==1 && j == height-3) || (i == 2 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //bottom left
                if((i ==  width-2 && j ==1) || (i ==width-3 && j ==  1) || (i == width-2 && j == 2)) {
                    arr[i][j].wall = false;
                    continue;
                }


                if(Math.random() < .8 && !arr[i][j].wall){
                    var rand = Math.random();
                    arr[i][j].box = true;
                    if(rand < 0.02)
                        arr[i][j].lifeP = true;
                    else if(rand < 0.07)
                        arr[i][j].boots = true;
                    else if (rand < 0.15)
                        arr[i][j].bombP = true;
                    else if (rand < 0.20)
                        arr[i][j].bombS = true;
                    else if(rand < 0.25)
                        arr[i][j].ghost = true;
                    else if(rand < 0.30)
                        arr[i][j].glueP = true;
                }
                
            }
        }
    }
    else if (type == 2){
        
        for(var i = 1; i < width-1; i++)
        {   
            for(var j = 1; j < height -1; j++){
                //bottom right
                if((i == width-2 && j == height-2) || (i == width-2 && j == height-3) || (i == width-3 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top left
                if((i == 1 && j == 1) || (i ==1 && j ==2) || (i == 2 && j == 1)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top right
                if((i == 1 && j == height-2) || (i ==1 && j == height-3) || (i == 2 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //bottom left
                if((i ==  width-2 && j ==1) || (i ==width-3 && j ==  1) || (i == width-2 && j == 2)) {
                    arr[i][j].wall = false;
                    continue;
                }


                if(Math.random() < .8 && !arr[i][j].wall){
                    var rand = Math.random();
                    arr[i][j].box = true;
                    if(rand < 0.02)
                        arr[i][j].lifeP = true;
                    else if(rand < 0.07)
                        arr[i][j].boots = true;
                    else if (rand < 0.15)
                        arr[i][j].bombP = true;
                    else if (rand < 0.20)
                        arr[i][j].bombS = true;
                    else if(rand < 0.25)
                        arr[i][j].ghost = true;
                    else if(rand < 0.30)
                        arr[i][j].glueP = true;
                }
                
            }
        }
    }
    return arr;
}
function createGrid(width, height){
   var arr = []

    for(var i = 0; i < width; i++)
    {   
        arr.push([])
        for(var j = 0; j < height; j++){
           
            arr[i].push({})
            
           

            
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
                    grid[x][y].fireTimer -= .6;
                }
                
            }
        }
        for(var x = 0; x  < grid.length; x++){
            for(var y = 0; y < grid[0].length; y++){
                 if(grid[x][y].bomb != undefined){
                    grid[x][y].bomb.timer -= 0.035;
                    if(grid[x][y].bomb.timer <= 0 ){
                        explodeBomb(grid, x, y) 
                    }
                    
                }
                
            }
        }
        for(var x = 0; x  < grid.length; x++){
            for(var y = 0; y < grid[0].length; y++){
                if(grid[x][y].box && grid[x][y].fireTimer > 0){
                    grid[x][y].box = false;
                    grid[x][y].fireTimer = -1
                }
            }
        }
        var send = compress(room);
        //io.sockets.in(active[i]).volatile.emit('game-update', send);
            
    }


 
}
function explodeBomb(grid, x, y){
    var bomb = grid[x][y].bomb
    if(bomb.player)
        grid[x][y].bomb.player.bombCount -= 1;
    grid[x][y].bomb = undefined;
    for(var k = 0; k <= bomb.strength; k++){
        
        if(grid[x + k][y].wall)
            break; 
         
        if(grid[x+k][y].bomb){
            explodeBomb(grid, x+k, y);
            break;
        }
        grid[x+k][y].fireTimer = 1;  
        if(grid[x + k][y].box)
            break;
    }
    for(var k = 0; k <= bomb.strength; k++){
        
        if(grid[x - k][y].wall)
            break; 
        
        if(grid[x-k][y].bomb){
            explodeBomb(grid, x-k, y);
        }
        grid[x-k][y].fireTimer = 1; 
        if(grid[x - k][y].box)
            break;  
    }
    for(var k = 0; k <= bomb.strength; k++){
        
        if(grid[x][y + k].wall)
            break; 
        
        if(grid[x][y+k].bomb){
            explodeBomb(grid, x, y+k);
        }
        grid[x][y + k].fireTimer = 1;  
        if(grid[x ][y+k].box)
            break; 
    }
    for(var k = 0; k <= bomb.strength; k++){
        
        if(grid[x][y -k].wall)
            break;
        
        if(grid[x][y-k].bomb){
            explodeBomb(grid, x, y-k);
        } 
        grid[x][y-k].fireTimer = 1; 
        if(grid[x ][y-k].box)
            break;  
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
        if(timer < 3){
            var send = compress(room);
            io.sockets.in(active[i]).volatile.emit('game-update', send);
            continue;
        }
        timer  = timer / 60
        if(timer > 2){
            addBomb(grid, (timer -2 ) /10 + 1);
        }
        var alivePlayers = 0
        var updateLives = false;
        for(var j = 0; j < players.length; j++){
            
            var player = players[j]
            if(player.lives <= 0){ continue;}
            alivePlayers += 1;
            var position = player.position;
            var direction = player.direction;
            var x = Math.floor(position.x);
            var y = Math.floor(position.y);
            if(grid[x][y].boots){
                player.speed += 0.01;
                if(player.speed > 0.15){
                    player.speed = 0.15;
                }
                grid[x][y].boots = false;
            }
            if(grid[x][y].bombP){
                player.bombMax += 1;
                grid[x][y].bombP = false;
            }
            if(grid[x][y].bombS){
                player.bombStrength += 1;
                grid[x][y].bombS = false;
            }
            if(grid[x][y].lifeP){
                player.lives += 1;
                grid[x][y].lifeP = false;
                updateLives= true;
            }
            if(grid[x][y].ghost){
                player.ghost = 3.0;
                grid[x][y].ghost = false;
            }
            if(grid[x][y].glueP){
                player.glue += 3;
                grid[x][y].glueP = false;
            }

            x = position.x;
            y = position.y;


            if(player.invulnerable >= 0){ player.invulnerable -= 0.01;}
            if(player.ghost >= 0){ player.ghost -= 0.01;}
            if(grid[Math.floor(position.x)][Math.floor(position.y)].fireTimer >= 0 && player.invulnerable < 0){
                player.lives -= 1;
                
                player.invulnerable = 1;
                updateLives= true;
            }
            ///////////
            var speed = player.speed;
            if(grid[Math.floor(position.x)][Math.floor(position.y)].glue){
                speed = 0.03;
            }


            if(direction.up){
                player.moving = true;
                player.dir = "back"
                var cx = position.x - Math.floor(position.x)
                if(cx!= 0.5){
                    if(cx < 0.5){
                        if(cx + speed > 0.6){
                            position.x = position.x + (0.5 - cx);
                        }
                        else{
                            position.x = position.x +  speed;
                        }
                    }
                    else{
                        if(cx - speed < 0.5){
                            position.x = position.x - (cx- 0.5);
                        }
                        else{
                            position.x = position.x - speed;
                        }
                    }
                }
                else{
                    var ny = position.y -speed;
                    var nx = position.x;
                    if(canMove(nx, ny ,  x ,y, grid))
                        position.y = position.y - speed
                }
                
            }
            else if(direction.down){
                player.moving = true;
                player.dir = "front"
                var cx = position.x - Math.floor(position.x)

                if(cx!= 0.5){
                    if(cx < 0.5){
                        if(cx + speed > 0.5){
                            position.x = position.x + (0.5 - cx);
                        }
                        else{
                            position.x = position.x +  speed;
                        }
                    }
                    else{
                        if(cx - speed < 0.5){
                            position.x = position.x - (cx- 0.5);
                        }
                        else{
                            position.x = position.x -speed;
                        }
                    }
                }
                else{
                    var ny = position.y + speed;
                    var nx = position.x;
                    if(canMove(nx, ny ,  x ,y, grid))
                        position.y = position.y + speed
                }
            }
            else if(direction.right){
                player.moving = true;
                player.dir = "right"
                var cy = position.y - Math.floor(position.y)

                if(cy!= 0.5){
                    if(cy < 0.5){
                        if(cy + speed > 0.5){
                            position.y = position.y + (0.5 - cy);
                        }
                        else{
                            position.y = position.y +  speed;
                        }
                    }
                    else{
                        if(cy - speed < 0.5){
                            position.y = position.y - (cy- 0.5);
                        }
                        else{
                            position.y = position.y - speed;
                        }
                    }
                }
                else{
                    var ny = position.y ;
                    var nx = position.x + speed;
                    if(canMove(nx, ny ,  x ,y, grid))
                        position.x = position.x + speed
                }
            }
            else if(direction.left){
                player.moving = true;
                player.dir = "left"
                var cy = position.y - Math.floor(position.y)
                if(cy!= 0.5){
                    if(cy < 0.5){
                        if(cy + speed > 0.5){
                            position.y = position.y + (0.5 - cy);
                        }
                        else{
                            position.y = position.y +  speed;
                        }
                    }
                    else{
                        if(cy - speed < 0.5){
                            position.y = position.y - (cy- 0.5);
                        }
                        else{
                            position.y = position.y - speed;
                        }
                    }
                }
                else{
                    var ny = position.y ;
                    var nx = position.x -speed;
                    if(canMove(nx, ny ,  x ,y, grid))
                        position.x = position.x - speed
                }
            }
            else{
                player.moving = false;
            }
            if(direction.bomb){
                if(player.bombCount < player.bombMax  &&  grid[Math.floor(position.x)][Math.floor(position.y)].bomb == undefined){
                    grid[Math.floor(position.x)][Math.floor(position.y)].bomb = {player: player, timer: 1, active: true, strength: player.bombStrength}
                    player.bombCount +=1;
                }
                direction.bomb = false;
            }
            if(direction.glue){
                if(player.glue  > 0  &&  grid[Math.floor(position.x)][Math.floor(position.y)].glue == undefined){
                    grid[Math.floor(position.x)][Math.floor(position.y)].glue = true;
                    player.glue -=1;
                }
                direction.glue = false;
            }

        }
        

        var send = compress(room);
        io.sockets.in(active[i]).emit('game-update', send);

        if(updateLives){
            io.sockets.in(active[i]).emit('score-update', players);
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

            io.sockets.in(active[i]).emit('game-over', data);
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
        minPlayers[i] = {
            position: players[i].position, lives: players[i].lives, dir:players[i].dir, 
            moving: players[i].moving, name: players[i].name,
            ghost:players[i].ghost, id:players[i].id, character:players[i].character
        }
    }
    var walls = [];
    var boxes = [];
    var fire = [];
    var bombs = [];
    var powerups = [];
    var glue = [];
    for( var i = 0; i < grid.length; i++){
        for( var j = 0; j < grid[0].length; j++){
      
            if(grid[i][j].fireTimer >= 0){fire.push({x:i, y:j})}
     
            else if(grid[i][j].box)     {boxes.push({x:i, y:j})}

            if(grid[i][j].bomb){bombs.push({x:i, y:j})}

            if(grid[i][j].glue){glue.push({x:i, y:j})}
    

            else if(!grid[i][j].box && grid[i][j].bombP){powerups.push({x:i, y:j, t:"bomb-boost"})}
            else if(!grid[i][j].box && grid[i][j].boots){powerups.push({x:i, y:j, t:"speed-boost"})}
            else if(!grid[i][j].box && grid[i][j].bombS){powerups.push({x:i, y:j, t:"bomb-strength"})}
            else if(!grid[i][j].box && grid[i][j].lifeP){powerups.push({x:i, y:j, t:"extra-life"})}
            else if(!grid[i][j].box && grid[i][j].ghost){powerups.push({x:i, y:j, t:"ghost"})}
            else if(!grid[i][j].box && grid[i][j].glueP){powerups.push({x:i, y:j, t:"glue"})}
        }
    }
    return {boxes: boxes,fire:fire, glue:glue, players: minPlayers,bombs:bombs, powerups:powerups, time: time};

}
function validGrid(g){
    var count = 0;
    var arr = [{x:1, y:1}];
    var width = g.length;
    var height = g[0].length;
    while(arr.length > 0){
        var pos = arr.pop();
        if(g[pos.x][pos.y].visited != undefined){continue;}
        g[pos.x][pos.y].visited = true;
        if(pos.x == width - 2 && pos.y == height-2){count++;}
        if(pos.x == width - 2 && pos.y == 1){count++;}
        if(pos.x == 1 && pos.y == height-2){count++;}

        if(!g[pos.x + 1][pos.y].wall && !g[pos.x + 1][pos.y].visited){arr.push({x:pos.x+1, y:pos.y})}
        if(!g[pos.x - 1][pos.y].wall && !g[pos.x - 1][pos.y].visited){arr.push({x:pos.x-1, y:pos.y})}
        if(!g[pos.x][pos.y+1].wall && !g[pos.x][pos.y+1].visited){arr.push({x:pos.x, y:pos.y+1})}
        if(!g[pos.x][pos.y-1].wall && !g[pos.x][pos.y-1].visited){arr.push({x:pos.x, y:pos.y-1})}
    }
    if(count == 3){
        return true;
    }
    else{
        return false;
    }
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
        grid[x][y].bomb = {player: undefined, timer: 1, active: true, strength:2}
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
