
function createGrid(width, height){
    var arr = []
    for(var i = 0; i < width; i++)
    {   
        arr.push([])
        for(var j = 0; j < height; j++){
            arr[i].push({});
        }
    }
    return arr;
}

function createRoom(){
    socket.emit('create-game', {name: name});

}
function joinRoom(id){
    socket.emit('join-game', {name: name, room: id})
}
function invalidRoom(data){
    console.log('invalid room');
}
function waitingRoom(data){
    removeElements(); 
    var leader = data.leader;
    data = data.room;
    var players = data.players;
    var size = data.size;
    var code = data.id;
    
    var WaitingDiv = createElement("div");
    WaitingDiv.class("waiting-div");

    var prompt = createElement("h2", 'Waiting for more players to join');
    prompt.class("title")
    prompt.parent(WaitingDiv)

    var PlayersDiv = createElement("div");
    PlayersDiv.class("text-wrapper")
    for (var i = 0; i < players.length; i++){
        var player = createElement("p", players[i].name);
        player.parent(PlayersDiv);
    }
    if(players.length < 2){
        var remaining = createElement("p", "Need at least 2 players to start");
        remaining.parent(PlayersDiv); 
    }
    PlayersDiv.parent(WaitingDiv);

    var imageWrapper = createElement("div");
    imageWrapper.class("center-div");
    var image = createImg('http://i.imgur.com/tOXXtXu.gif');
    image.parent(imageWrapper);
    imageWrapper.parent(WaitingDiv);

    var inviteDiv = createElement("div");
    inviteDiv.class("text-wrapper")
    var inviteMsg = createElement("p", "Invite others by using the code: " );
    var inviteCode = createElement("p", location.host + "/" + code );
  
    var button_leave = createButton('Leave Room');
    button_leave.class("button button-tiny center-div")


    button_leave.mousePressed(function(){
        socket.emit('leave-room')
        startMenu();
    });
    if(leader && players.length > 1){
        var button_start = createButton('Start Game');
        button_start.class("button center-div button-small")
        button_start.mousePressed(function(){
            socket.emit('start-room')
        });
    }
   


    inviteMsg.parent(inviteDiv);
    inviteCode.parent(inviteDiv);
    inviteDiv.parent(WaitingDiv);
    if(leader && players.length > 1){button_start.parent(WaitingDiv);}
    button_leave.parent(WaitingDiv);
    
    WaitingDiv.center();

}
function gameOver(data){
    for(var i = 0; i < players.length; i++){
        if(i == 0){
            p1.remove();
        }
        if(i == 1){
            p2.remove();
        }
        if(i == 2){
            p3.remove();
        }
        if(i == 3){
            p4.remove();
        }
    }
    
    
    
    
    var winner = data.winner
    var code = data.newRoom;
    var GameOverDiv = createElement("div");
    GameOverDiv.class("waiting-div");

    var prompt = createElement("h2", 'Game Over');
    prompt.class("title")
    prompt.parent(GameOverDiv)

    var WinnerDiv = createElement("div");
    WinnerDiv.class("text-wrapper")
    
    var winner = createElement("h3", winner + " has won the game");
    winner.parent(WinnerDiv);

    WinnerDiv.parent(GameOverDiv);

    console.log(code);

    
    var playAgainBtn = createButton('Play Again');
    playAgainBtn.class("button-small button");
    playAgainBtn.mousePressed(playAgain);

    playAgainBtn.parent(GameOverDiv);

    function playAgain(){
        joinRoom(code);
    }


    GameOverDiv.center();

}

function startGame(data){
    removeElements();
    background(51);
    state = "Current Game";
    grid = data.game.grid;
    squareSize = height/grid.length;
    players = data.players;
    if(mode=="2D"){
        startGame2D();
    
    }
    else{
        startGame3D();
    }

    drawScore();
    clearInterval(directionLoop);
    directionLoop = setInterval(updatePosition, 10);
}
function updateGame(data){
    walls = data.walls;
    boxes = data.boxes;
    time = data.time;
    players = data.players;
    bombs = data.bombs;
    powerups = data.powerups;
    fires = data.fire;
}

function updatePosition(){
    socket.emit('update-input', input);
    input.bomb = false;
}
function updateScore(data){
    console.log("updating score");
    players = data.players;
    drawScore();
}

function formatTime(rawTime){
    var timeval = parseFloat(rawTime) / 1000;
    ms = timeval - Math.floor(timeval)
    s = Math.floor(timeval)%60
    m = Math.floor(timeval)/60
    s = ("0" + parseInt(s)).slice(-2);
    m = ("0" + parseInt(m)).slice(-2);
    ms = parseInt(ms * 100);
    return (m + ":" + s + ":" + ms);
}