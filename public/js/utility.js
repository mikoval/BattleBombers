
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
    if(mode=="2D"){
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
                p2.addAnimation("front-true", bun_forward_animation);
                p2.addAnimation("right-true", bun_right_animation);
                p2.addAnimation("left-true", bun_left_animation);
                p2.addAnimation("back-true", bun_back_animation);
                p2.addAnimation("front-false", bun_forward_stand);
                p2.addAnimation("right-false", bun_right_stand);
                p2.addAnimation("left-false", bun_left_stand);
                p2.addAnimation("back-false", bun_back_stand);
            }
            if(i==2){
                p3  = createSprite(50, 50, squareSize, squareSize);
                p3.addAnimation("front-true", jones_forward_animation);
                p3.addAnimation("right-true", jones_right_animation);
                p3.addAnimation("left-true", jones_left_animation);
                p3.addAnimation("back-true", jones_back_animation);
                p3.addAnimation("front-false", jones_forward_stand);
                p3.addAnimation("right-false", jones_right_stand);
                p3.addAnimation("left-false", jones_left_stand);
                p3.addAnimation("back-false", jones_back_stand);
            }
            if(i==3){
                p4  = createSprite(50, 50, squareSize, squareSize);
                p4.addAnimation("front-true", spear_forward_animation);
                p4.addAnimation("right-true", spear_right_animation);
                p4.addAnimation("left-true", spear_left_animation);
                p4.addAnimation("back-true", spear_back_animation);
                p4.addAnimation("front-false", spear_forward_stand);
                p4.addAnimation("right-false", spear_right_stand);
                p4.addAnimation("left-false", spear_left_stand);
                p4.addAnimation("back-false", spear_back_stand);
            }
        }
    
    }
    else{
        var geometry = new THREE.BoxGeometry( 0.5, 0.5, 1 );
        scene = new THREE.Scene();
        for(var i = 0; i < players.length; i++){

            if(i==0){

               
                var material = new THREE.MeshPhongMaterial( {color: 0x00ff00} );
                p1 = new THREE.Mesh( geometry, material );
                scene.add( p1 );
            }
            if(i ==1 ){
                var material = new THREE.MeshPhongMaterial( {color: 0x0000FF} );
                p2 = new THREE.Mesh( geometry, material );
                scene.add( p2 );
            }
            if(i==2){
                var material = new THREE.MeshPhongMaterial( {color: 0xFF00FF} );
                p3 = new THREE.Mesh( geometry, material );
                scene.add( p3 );
            }
            if(i==3){
                var material = new THREE.MeshPhongMaterial( {color: 0xFF0000} );
                p4 = new THREE.Mesh( geometry, material );
                scene.add( p4 );
            }
        }
        geometry = new THREE.PlaneGeometry( grid.length , grid[0].length, 10 );
        camera.position.set(1,10,10);
        camera.up = new THREE.Vector3(0,0,1);
        camera.lookAt(new THREE.Vector3(0,0,-10));

    

        scene.add(camera);
        
        var uniforms = {
            resolution: { type: "v2", value: new THREE.Vector2(200, 200) },
            dimensions: { type: "v2", value: new THREE.Vector2(grid.length, grid[0].length) },
        };
        var material = new THREE.ShaderMaterial( {
            uniforms: uniforms,
            vertexShader: document.getElementById( 'gridvs' ).textContent,
            fragmentShader: document.getElementById( 'gridfs' ).textContent
        });


        var plane = new THREE.Mesh( geometry, material );
        plane.position.z = -10;

        //plane.rotation.z = Math.PI / 2;
        scene.add( plane );
        
        var pointLight =new THREE.PointLight(0xFFFFFF);

        // set its position
        pointLight.position.x = 0;
        pointLight.position.y = 20;
        pointLight.position.z = 50;

        // add to the scene
        scene.add(pointLight);
        

        }

    


        

    drawScore();
    clearInterval(directionLoop);
    directionLoop = setInterval(updatePosition, 20);
}
function updateGame(data){
    grid = data.grid;
    time = data.time;
    players = data.players;
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