var grid = createGrid(8,8);
var squareSize = 80;
function startMenu(){

    removeElements(); 

    state = "Start Menu";
    textSize(30);
    textAlign(CENTER);
    fill("White")
    var title = createElement("h1", 'Battle Bombers');
    title.class("title")
    title.center();
    title.position(null, height/5);

    var button_3D = createButton('3D Mode');
    button_3D.class("button button-tiny")
    button_3D.position(0,0);
   

    var button_2D = createButton('2D Mode');
    button_2D.class("button button-tiny")
    button_2D.position(0,0);



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
  

    
    button_3D.mousePressed(changeMode);
    button_2D.mousePressed(changeMode);



    
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
    
    create_button.mousePressed(create);
    join_button.mousePressed(joinMenu);

    if(mode=="2D"){
        button_2D.hide();
    }
    else{
        button_3D.hide();
    }

   


    

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

    function create(){
        createRoom()
    }
    function mainMenu(){
        JoinDiv.hide();
        JoinCreateDiv.show();
    }
    function joinMenu(){
        JoinCreateDiv.hide();
        JoinDiv.show();
    }
    function submitName(){
        var input_name = nameInput.value();
        if(checkName(input_name)){
            name = input_name;
            if(window.location.pathname.length >  1){

                console.log(window.location.pathname.split("/")[1])
                joinRoom(window.location.pathname.split("/")[1]);
                window.history.pushState('Home', 'Home', '/');
            }
            
            NameDiv.hide();
            JoinCreateDiv.show();
        }
    }
    function submitJoin(){
        var room_id = roomInput.value();
        joinRoom(room_id);
        
    }

    if(name == "undefined"){
        NameDiv.show();
    }
    else{

        JoinCreateDiv.show();
    }
    function changeMode(){
        if(mode=="3D"){
            mode = "2D";
            button_2D.hide();
            button_3D.show();
            $("#myContainer").show();
            $("#container2").hide();
        }
        else{
            button_2D.show();
            button_3D.hide();
            mode = "3D";
            $("#myContainer").hide();
            $("#container2").show();
        }
    }


}

function startMenuAnimation(){
    background(51);

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
function setup3DMenuAnimation(){
    // Set the scene size.
    WIDTH = window.width;
    HEIGHT = window.height;

    // Set some camera attributes.
    const VIEW_ANGLE = 45;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    // Get the DOM element to attach to
    container =
        document.querySelector('#container2');

    // Create a WebGL renderer, camera
    // and a scene
    renderer = new THREE.WebGLRenderer();
    camera =
        new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );

    camera.position.set(1,10,0);
    camera.up = new THREE.Vector3(0,0,1);
    camera.lookAt(new THREE.Vector3(0,0,-10));


    scene = new THREE.Scene();

    // Add the camera to the scene.
    scene.add(camera);

    // Start the renderer.
    renderer.setSize(WIDTH, HEIGHT);

    // Attach the renderer-supplied
    // DOM element.
    container.appendChild(renderer.domElement);


    var geometry = new THREE.PlaneGeometry( grid.length , grid[0].length, 10 );
    var uniforms = {
        resolution: { type: "v2", value: new THREE.Vector2(200, 200) },
        dimensions: { type: "v2", value: new THREE.Vector2(grid.length, grid[0].length) },
    };
    console.log( document.getElementById( 'gridvs' ).textContent)
    var material = new THREE.ShaderMaterial( {
        uniforms: uniforms,
        vertexShader: document.getElementById( 'gridvs' ).textContent,
        fragmentShader: document.getElementById( 'gridfs' ).textContent
    });


    var plane = new THREE.Mesh( geometry, material );
    plane.position.z = -10;
    //plane.rotation.z = Math.PI / 2;
    scene.add( plane );
    // create a point light
    const pointLight =new THREE.PointLight(0xFFFFFF);

    // set its position
    pointLight.position.x = 0;
    pointLight.position.y = 50;
    pointLight.position.z = 0;

    // add to the scene
    scene.add(pointLight);

    for(var i = 0; i < grid.length; i++){
        for (var j = 0; j < grid[0].length; j++){
            grid[i][j].fireObj = new fire(i,j);
        }
    }
}

function start3DMenuAnimation(){
    var rand = Math.random();
    if(rand < .01){
        var x = Math.floor( Math.random() * grid.length )
        var y = Math.floor( Math.random() * grid[0].length )
        if(!grid[x][y].bomb){
            grid[x][y].bomb = true;
            grid[x][y].bombTimer = 1;
            grid[x][y].bombObj = new bomb(x,y);
            scene.add(grid[x][y].bombObj);
        }
       
    }
    

    for(var i = 0; i < grid.length; i++){
        for (var j = 0; j < grid[0].length; j++){
            

            if(grid[i][j].fireTimer>0){
                grid[i][j].fireTimer -= .03;
                

            }
            if(grid[i][j].fireTimer<0){
                scene.remove(grid[i][j].fireObj);
            }

            if(grid[i][j].bomb){
                if(grid[i][j].fireTimer > 0){
                    grid[i][j].bombTimer = 0;
                }
                grid[i][j].bombTimer -= .005;
                if(grid[i][j].bombTimer  < 0){
                    menuExplode3D(i,j)
                }
            }
        }
    }
    




    background(51);
    if(renderer==undefined){
        setup3DMenuAnimation();
    }
    renderer.render(scene, camera);
}

function menuExplode3D(x,y){
    grid[x][y].bomb = false;
    scene.remove(grid[x][y].bombObj);
    
    scene.add(grid[x][y].fireObj);
    grid[x][y].fireTimer = 1;
    for(var i = 1; i < 3; i++){
        if(grid.length  > x + i) {
            grid[x+i][y].fireTimer = 1;
            scene.add(grid[x+i][y].fireObj);
            
                
        }
           
        if(0 <= x- i)
        {
            grid[x-i][y].fireTimer = 1;
                scene.add(grid[x-i][y].fireObj);
            
               
        } 
        if(grid[0].length  > y + i)
        {
            grid[x][y+i].fireTimer = 1;
            scene.add(grid[x][y+i].fireObj);
        
                
        } 
        if(0 <= y- i) 
        {
            grid[x][y-i].fireTimer = 1;
            scene.add(grid[x][y-i].fireObj);
            
                
        } 
        
            
    }

}
function menuExplode(x,y){
    grid[x][y].bomb = false;
    
    grid[x][y].fireTimer = 1;
    for(var i = 1; i < 3; i++){
        if(grid.length  > x + i) {
            grid[x+i][y].fireTimer = 1;
                
        }
           
        if(0 <= x- i)
        {
            grid[x-i][y].fireTimer = 1;
            
               
        } 
        if(grid[0].length  > y + i)
        {
            grid[x][y+i].fireTimer = 1;
        
                
        } 
        if(0 <= y- i) 
        {
            grid[x][y-i].fireTimer = 1;
            
                
        } 
        
            
    }
}
function checkName(name){
    return true;
}