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
    //socket.on('text', newText);

    bomb_img = loadImage("/Bomb.png"); 
    wall_img = loadImage("/Wall.png"); 
    wood_img = loadImage("/Wood.jpg"); 
    bomb_p_img = loadImage("/Bomb+.png"); 
    boots_img = loadImage("/Boots.png"); 
    fire_img = loadImage("/Fire.jpg")

    sword_forward_animation = loadAnimation("swordpics/front1.png", "swordpics/front4.png");
    sword_right_animation = loadAnimation("swordpics/right1.png", "swordpics/right4.png")
    sword_left_animation = loadAnimation("swordpics/left1.png", "swordpics/left4.png")
    sword_back_animation = loadAnimation("swordpics/back1.png", "swordpics/back4.png")
    sword_forward_stand = loadAnimation("swordpics/front1.png", "swordpics/front1.png");
    sword_right_stand = loadAnimation("swordpics/right1.png", "swordpics/right1.png")
    sword_left_stand = loadAnimation("swordpics/left1.png", "swordpics/left1.png")
    sword_back_stand = loadAnimation("swordpics/back1.png", "swordpics/back1.png")

    man_forward_animation = loadAnimation("manpics/front1.png", "manpics/front4.png");
    man_right_animation = loadAnimation("manpics/right1.png", "manpics/right4.png")
    man_left_animation = loadAnimation("manpics/left1.png", "manpics/left4.png")
    man_back_animation = loadAnimation("manpics/back1.png", "manpics/back4.png")
    man_forward_stand = loadAnimation("manpics/front1.png", "manpics/front1.png");
    man_right_stand = loadAnimation("manpics/right1.png", "manpics/right1.png")
    man_left_stand = loadAnimation("manpics/left1.png", "manpics/left1.png")
    man_back_stand = loadAnimation("manpics/back1.png", "manpics/back1.png")

    girl_forward_animation = loadAnimation("girlpics/front1.png", "girlpics/front7.png");
    girl_right_animation = loadAnimation("girlpics/right1.png", "girlpics/right7.png")
    girl_left_animation = loadAnimation("girlpics/left1.png", "girlpics/left7.png")
    girl_back_animation = loadAnimation("girlpics/back1.png", "girlpics/back7.png")
    girl_forward_stand = loadAnimation("girlpics/front1.png", "girlpics/front1.png");
    girl_right_stand = loadAnimation("girlpics/right1.png", "girlpics/right1.png")
    girl_left_stand = loadAnimation("girlpics/left1.png", "girlpics/left1.png")
    girl_back_stand = loadAnimation("girlpics/back1.png", "girlpics/back1.png")

    camel_forward_animation = loadAnimation("camelpics/front1.png", "camelpics/front3.png");
    camel_right_animation = loadAnimation("camelpics/right1.png", "camelpics/right3.png")
    camel_left_animation = loadAnimation("camelpics/left1.png", "camelpics/left3.png")
    camel_back_animation = loadAnimation("camelpics/back1.png", "camelpics/back3.png")
    camel_forward_stand = loadAnimation("camelpics/front1.png", "camelpics/front1.png");
    camel_right_stand = loadAnimation("camelpics/right1.png", "camelpics/right1.png")
    camel_left_stand = loadAnimation("camelpics/left1.png", "camelpics/left1.png")
    camel_back_stand = loadAnimation("camelpics/back1.png", "camelpics/back1.png")

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



