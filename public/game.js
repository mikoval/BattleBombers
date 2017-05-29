var socket;
var width;
var height;
var state;
var bomb_img;
var name = "";
function setup() {
    socket = io()
    socket.on('game-pending', waitingRoom);
    socket.on("invalid-room", invalidRoom);
    //socket.on('text', newText);

    bomb_img = loadImage("/Bomb.png"); 
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
}

