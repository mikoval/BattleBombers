var grid = createGrid(8,8);
var squareSize = 80;
function startMenu(){
    state = "Start Menu";
    textSize(30);
    textAlign(CENTER);
    fill("White")
    var title = createElement("h1", 'Temporary Game Title');
    title.class("title")
    title.center();
    title.position(null, height/5);
    
    //menu for choosing to join or create
    var join_button = createButton('Join Game');
    join_button.class("button button-lg")
    join_button.center();
    join_button.position(null,height/3 + 40);
    var create_button = createButton('Create Game');
    create_button.class("button button-lg")
    create_button.center();
    create_button.position(null,height/3 + 200);
    
    create_button.mousePressed(createMenu);
    join_button.mousePressed(joinMenu);

    // code for creating game menu
    var promptCreate = createElement("h2", 'Select Game Mode');
    promptCreate.class("title")
    promptCreate.center();
    promptCreate.position(null, height/3 - 30);
    promptCreate.hide();

    var twoP = createButton('Two Player');
    twoP.class("button-small button");
    twoP.center();
    twoP.position(null, height/3 + 30).hide();
    twoP.hide();

    var threeP = createButton('Three Player');
    threeP.class("button-small button");
    threeP.center();
    threeP.position(null, height/3 + 80).hide();
    threeP.hide();

    var fourP = createButton('Four Player');
    fourP.class("button-small button");
    fourP.center();
    fourP.position(null, height/3 + 130).hide();

    var back = createButton('Back');
    back.class("button-small button-error");
    back.center();
    back.position(null, height/3 + 180).hide();
    back.mousePressed(mainMenu);
    fourP.hide();

    // code for joining a room
    var promptJoin = createElement("h2", 'Enter game code to join');
    promptJoin.class("title")
    promptJoin.center();
    promptJoin.position(null, height/3 - 30);
    promptJoin.hide();

    var roomInput = createInput();
    roomInput.class("input-large");
    roomInput.center();
    roomInput.attribute("placeholder", "Enter room code")
    roomInput.position(null, height/3 + 40);
    roomInput.hide();

    function createMenu(){
        create_button.hide();
        join_button.hide();
        promptCreate.show();
        twoP.show();
        threeP.show();
        fourP.show();
        back.show();
    }
    function mainMenu(){
        //show new
        create_button.show();
        join_button.show();
        // hide create
        promptCreate.hide();
        twoP.hide();
        threeP.hide();
        fourP.hide();
        // hide join
        promptJoin.hide();
        roomInput.hide();


        back.hide();
    }
    function joinMenu(){
        create_button.hide();
        join_button.hide();
        promptJoin.show();
        roomInput.show();
        back.show();

    }
    

}

function startMenuAnimation(){
    var rand = Math.random();
    if(rand < .01){
        var x = Math.floor( Math.random() * grid.length )
        var y = Math.floor( Math.random() * grid[0].length )
        grid[x][y].bomb = true;
        grid[x][y].bombTimer = 1;
    }
    var centerX = width/2;
    var centerY = height/2;
    var startX = centerX - grid.length/2 * squareSize;
    var startY = centerY - grid[0].length/2 * squareSize;
    
    for(var i = 0; i < grid.length; i++){
        for (var j = 0; j < grid[0].length; j++){
            var x = startX+i*squareSize;
            var y = startY + j * squareSize;
            if(grid[i][j].fireTimer>0){
                grid[i][j].fireTimer -= .03;
                fill("#AA3030")

            }
            else{fill("#A0A0A0")}
            rect(x, y, squareSize, squareSize);
            if(grid[i][j].bomb){
                image(bomb_img, x, y, squareSize,squareSize);
                if(grid[i][j].fireTimer > 0){
                    grid[i][j].bombTimer = 0;
                }
                grid[i][j].bombTimer -= .005;
                if(grid[i][j].bombTimer  < 0){
                    menuExplode(i,j)
                }
            }
        }
    }
}
function menuExplode(x,y){
    grid[x][y].bomb = false;
    grid[x][y].fire = true;
    for(var i = 0; i < 3; i++){
        if(grid.length  > x + i) 
            grid[x+i][y].fireTimer = 1;
        if(0 <= x- i) 
            grid[x-i][y].fireTimer = 1;
        if(grid[0].length  > y + i) 
            grid[x][y+i].fireTimer = 1;
        if(0 <= y- i) 
            grid[x][y-i].fireTimer = 1;
    }

}