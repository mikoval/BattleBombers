
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

function createRoom(number){
    socket.emit('create-game', {name: name, size:number});

}
function joinRoom(id){
    socket.emit('join-game', {name: name, room: id})
}
function invalidRoom(data){
    console.log('invalid room');
}
function waitingRoom(data){
    removeElements(); 
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
    var remaining = createElement("p", "Need " + (size - players.length) + " player(s) to start");
    remaining.parent(PlayersDiv);

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
  
    inviteMsg.parent(inviteDiv);
    inviteCode.parent(inviteDiv);
    inviteDiv.parent(WaitingDiv);
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
    for(var i = 0; i < players.length; i++){
        if(i==0){

            p1  = createSprite(50, 50, squareSize, squareSize);
            p1.addAnimation("front-true", fox_forward_animation);
            p1.addAnimation("right-true", fox_right_animation);
            p1.addAnimation("left-true", fox_left_animation);
            p1.addAnimation("back-true", fox_back_animation);
            p1.addAnimation("front-false", fox_forward_stand);
            p1.addAnimation("right-false", fox_right_stand);
            p1.addAnimation("left-false", fox_left_stand);
            p1.addAnimation("back-false", fox_back_stand);
        }
        if(i ==1 ){
            p2  = createSprite(50, 50, squareSize, squareSize);
            p2.addAnimation("front-true", girl_forward_animation);
            p2.addAnimation("right-true", girl_right_animation);
            p2.addAnimation("left-true", girl_left_animation);
            p2.addAnimation("back-true", girl_back_animation);
            p2.addAnimation("front-false", girl_forward_stand);
            p2.addAnimation("right-false", girl_right_stand);
            p2.addAnimation("left-false", girl_left_stand);
            p2.addAnimation("back-false", girl_back_stand);
        }
        if(i==2){
            p3  = createSprite(50, 50, squareSize, squareSize);
            p3.addAnimation("front-true", man_forward_animation);
            p3.addAnimation("right-true", man_right_animation);
            p3.addAnimation("left-true", man_left_animation);
            p3.addAnimation("back-true", man_back_animation);
            p3.addAnimation("front-false", man_forward_stand);
            p3.addAnimation("right-false", man_right_stand);
            p3.addAnimation("left-false", man_left_stand);
            p3.addAnimation("back-false", man_back_stand);
        }
        if(i==3){
            p4  = createSprite(50, 50, squareSize, squareSize);
            p4.addAnimation("front-true", camel_forward_animation);
            p4.addAnimation("right-true", camel_right_animation);
            p4.addAnimation("left-true", camel_left_animation);
            p4.addAnimation("back-true", camel_back_animation);
            p4.addAnimation("front-false", camel_forward_stand);
            p4.addAnimation("right-false", camel_right_stand);
            p4.addAnimation("left-false", camel_left_stand);
            p4.addAnimation("back-false", camel_back_stand);
        }
    }
    

    


    

    drawScore();
    clearInterval(directionLoop);
    directionLoop = setInterval(updatePosition, 30);
}
function updateGame(data){
    players = data.players;
    grid = data.grid;
    time = data.time;
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