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

    //menu for picking name
    var NameDiv = createElement("div");
    NameDiv.class("menu-div");

    var promptJoin = createElement("h2", 'Enter your name');
    promptJoin.class("title")
    promptJoin.parent(NameDiv)

    var nameInputDiv = createElement("div")
    nameInputDiv.class("center-div");
    var nameInput = createInput();
    nameInput.class('input-large')
    nameInput.attribute("placeholder", "Enter name")
    nameInput.parent(nameInputDiv);
    nameInputDiv.parent(NameDiv);
   
    var nameSubmitDiv = createElement("div")
    nameSubmitDiv.class("center-div");
    var nameSubmit = createButton('Submit');
    nameSubmit.class("button-small button");
    nameSubmit.mousePressed(submitName);
    nameSubmit.parent(nameSubmitDiv);
    nameSubmitDiv.parent(NameDiv);

    NameDiv.center();
    NameDiv.hide()


    
    //menu for choosing to join or create
    var JoinCreateDiv = createElement("div");
    JoinCreateDiv.class("menu-div");

    var join_button = createButton('Join Game');
    join_button.class("button button-lg")
    join_button.parent(JoinCreateDiv);

    var create_button = createButton('Create Game');
    create_button.class("button button-lg")
    create_button.parent(JoinCreateDiv);
    JoinCreateDiv.center();
    JoinCreateDiv.hide();
    
    create_button.mousePressed(createMenu);
    join_button.mousePressed(joinMenu);

    // code for creating game menu
    var CreateDiv = createElement("div");
    CreateDiv.class("menu-div");

    var promptCreate = createElement("h2", 'Select Game Mode');
    promptCreate.class("title")
    promptCreate.parent(CreateDiv);
  

    var twoP = createButton('Two Player');
    twoP.class("button-small button");
    twoP.parent(CreateDiv);
    twoP.mousePressed(createTwoP);

    var threeP = createButton('Three Player');
    threeP.class("button-small button");
    threeP.parent(CreateDiv);
    threeP.mousePressed(createThreeP);

    var fourP = createButton('Four Player');
    fourP.class("button-small button");
    fourP.parent(CreateDiv);
    fourP.mousePressed(createFourP);
    

    var createBack = createButton('Back');
    createBack.class("button-small button-error");
    createBack.mousePressed(mainMenu);
    createBack.parent(CreateDiv);

    CreateDiv.center();
    CreateDiv.hide();


    

    // code for joining a room
    var JoinDiv = createElement("div");
    JoinDiv.class("menu-div");

    var promptJoin = createElement("h2", 'Enter game code to join');
    promptJoin.class("title")
    promptJoin.parent(JoinDiv)

    var roomInputDiv = createElement("div")
    roomInputDiv.class("center-div");
    var roomInput = createInput();
    roomInput.class('input-large')
    roomInput.attribute("placeholder", "Enter room code")
    roomInput.parent(roomInputDiv);
    roomInputDiv.parent(JoinDiv);
   
    var roomSubmitDiv = createElement("div")
    roomSubmitDiv.class("center-div");
    var roomSubmit = createButton('Submit');
    roomSubmit.class("button-small button");
    roomSubmit.mousePressed(submitJoin);
    roomSubmit.parent(roomSubmitDiv);
    roomSubmitDiv.parent(JoinDiv);


    var backDiv = createElement("div")
    backDiv.class("center-div");
    var joinBack = createButton('Back');
    joinBack.class("button-small button-error");
    joinBack.mousePressed(mainMenu);
    joinBack.parent(backDiv);
    backDiv.parent(JoinDiv);

    JoinDiv.center();
    JoinDiv.hide()

    function createMenu(){
        JoinCreateDiv.hide();
        CreateDiv.show()
    }
    function mainMenu(){

        JoinCreateDiv.show();
        CreateDiv.hide();
        JoinDiv.hide();
    }
    function joinMenu(){
        JoinCreateDiv.hide();
        JoinDiv.show();
    }
    function createTwoP(){createRoom(2); CreateDiv.hide();}
    function createThreeP(){createRoom(3); CreateDiv.hide();}
    function createFourP(){createRoom(4); CreateDiv.hide();}
    function submitName(){
        var input_name = nameInput.value();
        if(checkName(input_name)){
            name = input_name;
            if(window.location.pathname.length >  1){
                console.log(window.location.pathname.split("/")[1])
                joinRoom(window.location.pathname.split("/")[1]);
            }
            
            NameDiv.hide();
            JoinCreateDiv.show();
        }
    }
    function submitJoin(){
        var room_id = roomInput.value();
        joinRoom(room_id);
        
    }
    if(name == ""){
        NameDiv.show();
    }
    else{
        JoinCreateDiv.show();
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
function checkName(name){
    return true;
}