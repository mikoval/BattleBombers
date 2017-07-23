var socket;
var width;
var height;
var state;
var bomb_img;
var wall_img;
var wood_img;
var bomb_p_img;
var boots_img;
var life_img;
var name = "undefined";
var grid;
var squareSize;
var players=[];
var bombs2=[];
var walls2=[];
var boxes2=[];
var fires2 = [];
var powerups2 = [];
var input = {up: false, down: false, left: false, right: false, bomb : false};
var directionLoop;
var time = 0;
var p1;
var p2; 
var p3;
var p4;
var drawn = false;
var mode = "2D";
var renderer;
var woodMaterial;
var wallMaterial;
var fireMaterial;
var fireMaterial;
var walls = [];
var boxes = [];
var fires = [];
var bombs = [];
var powerups =[];




var forward_animation;
function setup() {
    frameRate(30);
    socket = io()
    socket.on('game-pending', waitingRoom);
    socket.on('game-start', startGame);
    socket.on('game-update', updateGame);
    socket.on('score-update', updateScore);
    socket.on("invalid-room", invalidRoom);
    socket.on("game-over", gameOver);
    setInterval(function(){socket.emit('ping')}, 20000);
    //socket.on('text', newText);

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
        if(mode=="3D"){
            start3DMenuAnimation();
        }
        else{
            startMenuAnimation();
        }
        
    }
    else if (state == "Current Game"){
        if(mode=="3D"){
             drawGame3D();
        }
        else{
             drawGame();
        }
       
    }
}
function keyPressed(e) {

    if(state != "Current Game"){return;}
    e.preventDefault();
    var key  = e.key;
    if(key == "w" || key == "ArrowUp"){input.up = true; input.down = false; input.right = false; input.left = false}
    if(key == "d" || key == "ArrowRight"){input.up = false; input.down = false; input.right = true; input.left = false}
    if(key == "s" || key == "ArrowDown"){input.up = false; input.down = true; input.right = false; input.left = false}
    if(key == "a" || key == "ArrowLeft"){input.left =input.up = false; input.down = false; input.right = false; input.left = true}
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



