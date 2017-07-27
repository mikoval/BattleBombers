
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
    var characterList = createElement('div')
    var characterWrapper = createElement('div')
    characterWrapper.class('center-div');
    characterList.class('img-list')
    characterList.parent(characterWrapper);
    for(var i = 0; i < 4; i++){
        var img;
        if(i ==0){
            img = createImg('/Images/FoxPics/front1.png');
            img.class('fox select-img');
            img.id("fox");
        }
            
        if(i ==1){
            img = createImg('/Images/bunpics/front1.png');
            img.class("bun select-img");
            img.id("bun");
        }
            
        if(i ==2){
            img = createImg('/Images/jonespics/front1.png');
            img.class('jones select-img')
            img.id("jones");
        }
            
        if(i ==3){
            img = createImg('/Images/spearpics/front1.png');
            img.class('spear select-img');
            img.id("spear");


        }
    
       
        img.parent(characterList)
    }
    var selectedCharacterWrapper = createElement('div')
    selectedCharacterWrapper.class("center-div");
    var current;
    for(var i = 0; i < players.length; i++){
        if(players[i].id == socket.id){
            if(players[i].character == "fox")
                current = createImg('/Images/FoxPics/front1.png');
            else if(players[i].character == "bun")
                current = createImg('/Images/bunpics/front1.png');
            else if(players[i].character == "jones")
                current = createImg('/Images/jonespics/front1.png');
            else if(players[i].character == "spear")
                current = createImg('/Images/spearpics/front1.png');
          
            current.class("current-character");

        }

    }
    current.parent(selectedCharacterWrapper);
    characterWrapper.parent(WaitingDiv);
    selectedCharacterWrapper.parent(WaitingDiv);


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
    for(var i = 0; i < players.length; i++){
        $("." + players[i].character).addClass("character-selected");
    }
    $(".select-img").on('click', function(){
        if($(this).hasClass("character-selected") )  {return;}
        var c = $(this).attr("id");
        socket.emit("character-update", c);
    });

}
function gameOver(data){
    for(var i = 0; i < sprites.length; i++){
        sprites[i].remove();
    }
    sprites = [];
    
    
    
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
    sprites = [];
    if(mode=="2D"){
        startGame2D();
    
    }
    else{
        startGame3D();
    }
    walls  = [];
    for(var i = 0; i < grid.length; i++){
        for (var j = 0; j < grid[0].length; j++){
            if(grid[i][j].wall){
                walls.push({x:i, y:j});
            }
            
            
        }
    }

    drawScore();
    clearInterval(directionLoop);
    directionLoop = setInterval(updatePosition, 10);
}
function updateGame(data){
  
    boxes = data.boxes;
    time = data.time;
    players = data.players;
    bombs = data.bombs;
    powerups = data.powerups;
    fires = data.fire;
    glue = data.glue;
}

function updatePosition(){
    socket.emit('update-input', input);
    input.bomb = false;
    input.glue = false;
}
function updateScore(data){

   
    players = players;
    console.log(players);m
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