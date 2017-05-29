var width;
var height;
var state;
var bomb;
function setup() {
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

