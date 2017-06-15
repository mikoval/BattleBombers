var socket;
var width;
var height;
var state;
var bomb_img;
var wall_img;
var wood_img;
var bomb_p_img;
var boots_img;
var name = "";
var grid;
var squareSize;
var players;
var input = {up: false, down: false, left: false, right: false, bomb : false};
var directionLoop;
var time = 0;
var p1;
var p2; 
var p3;
var p4;
var drawn = false;


var forward_animation;
function setup() {
    frameRate(30);
    socket = io()
    socket.on('game-pending', waitingRoom);
    socket.on('game-start', startGame);
    socket.on('game-update', updateGame);
    socket.on('player-update', updatePlayers);
    socket.on('score-update', updateScore);
    socket.on("invalid-room", invalidRoom);
    socket.on("game-over", gameOver);
    //socket.on('text', newText);

    bomb_img = loadImage("/Bomb.png"); 
    wall_img = loadImage("/Wall.png"); 
    wood_img = loadImage("/Wood.jpg"); 
    bomb_p_img = loadImage("/Bomb+.png"); 
    boots_img = loadImage("/Boots.png"); 
    fire_img = loadImage("/Fire.jpg")

    loadImages();
    width = document.body.clientWidth;
    height = document.body.clientHeight;

    var myCanvas = createCanvas(width, height);
    myCanvas.parent('myContainer');
    background(51);



    startMenu();
}
function draw(){
    if(state == "Start Menu"){
        startMenuAnimation();
    }
    else if (state == "Current Game"){
        drawGame();
    }
}
function keyPressed(e) {

    if(state != "Current Game"){return;}
    e.preventDefault();
    var key  = e.key;
    if(key == "w" || key == "ArrowUp"){input.up = true;}
    if(key == "d" || key == "ArrowRight"){input.right = true;}
    if(key == "s" || key == "ArrowDown"){input.down = true;}
    if(key == "a" || key == "ArrowLeft"){input.left = true;}
    if(key == " "){input.bomb = true;}
}
function keyReleased(e) {
    if(state != "Current Game"){return;}
    e.preventDefault();

    var key  = e.key;
    if(key == "w" || key == "ArrowUp"){input.up = false;}
    if(key == "d" || key == "ArrowRight"){input.right = false;}
    if(key == "s" || key == "ArrowDown"){input.down = false;}
    if(key == "a" || key == "ArrowLeft"){input.left = false;}
    //if(key == " "){direction.bomb = false;}
}



