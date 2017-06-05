var socket;
var width;
var height;
var state;
var bomb_img;
var wall_img;
var wood_img;
var name = "";
var grid;
var squareSize;
var players;
var direction = {up: false, down: false, left: false, right: false};
var directionLoop;
function setup() {
    console.log(frameRate(30));
    socket = io()
    socket.on('game-pending', waitingRoom);
    socket.on('game-start', startGame);
    socket.on('game-update', updateGame);
    socket.on('score-update', updateScore);
    socket.on("invalid-room", invalidRoom);
    //socket.on('text', newText);

    bomb_img = loadImage("/Bomb.png"); 
    wall_img = loadImage("/Wall.png"); 
    wood_img = loadImage("/Wood.jpg"); 
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
    console.log("preventDefault")
    e.preventDefault();
    var key  = e.key;
    if(key == "w" || key == "ArrowUp"){direction.up = true;}
    if(key == "d" || key == "ArrowRight"){direction.right = true;}
    if(key == "s" || key == "ArrowDown"){direction.down = true;}
    if(key == "a" || key == "ArrowLeft"){direction.left = true;}
    if(key == " "){direction.bomb = true;}
}
function keyReleased(e) {
    if(state != "Current Game"){return;}
    e.preventDefault();

    var key  = e.key;
    if(key == "w" || key == "ArrowUp"){direction.up = false;}
    if(key == "d" || key == "ArrowRight"){direction.right = false;}
    if(key == "s" || key == "ArrowDown"){direction.down = false;}
    if(key == "a" || key == "ArrowLeft"){direction.left = false;}
    //if(key == " "){direction.bomb = false;}
}
window.addEventListener('keydown', function (event) {

    
       // event.preventDefault();



});



