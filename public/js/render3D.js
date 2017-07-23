function startGame3D(){
    bombs=[];
    walls=[];
    boxes=[];
    fires = [];
    powerups = [];

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
function draw3D(){

    animate();
    


    for(var i = 0; i < walls2.length; i++){
        if(!exists(walls2[i], walls)){
            scene.remove(walls2[i]);
            walls2.splice(i,1);
        }
    }
    for(var i = 0; i < walls.length; i++){
        if(!exists(walls[i], walls2)){
            var w = wall(walls[i].x, walls[i].y);
            w.x = walls[i].x;
            w.y = walls[i].y;
            walls2.push(w);
            scene.add(walls2[walls2.length-1]);

        }
    }
    //boxes check
    for(var i = 0; i < boxes2.length; i++){
        if(!exists(boxes2[i], boxes)){
            scene.remove(boxes2[i]);
            boxes2.splice(i,1);
        }
    }
    for(var i = 0; i < boxes.length; i++){
        if(!exists(boxes[i], boxes2)){
            var b = createBox(boxes[i].x, boxes[i].y);
            b.x = boxes[i].x;
            b.y = boxes[i].y;
            boxes2.push(b);
            scene.add(boxes2[boxes2.length-1]);

        }
    }
    //bombs check
    for(var i = 0; i < bombs2.length; i++){
        if(!exists(bombs2[i], bombs)){
            scene.remove(bombs2[i]);
            bombs2.splice(i,1);
        }
    }
    for(var i = 0; i < bombs.length; i++){
        if(!exists(bombs[i], bombs2)){
            var b = bomb(bombs[i].x, bombs[i].y);
            b.x = bombs[i].x;
            b.y = bombs[i].y;
            bombs2.push(b);
            scene.add(bombs2[bombs2.length-1]);

        }
    }
    //fire check
    for(var i = 0; i < fires2.length; i++){
        if(!exists(fires2[i], fires)){
            scene.remove(fires2[i]);
            fires2.splice(i,1);
        }
    }
    for(var i = 0; i < fires.length; i++){
        if(!exists(fires[i], fires2)){
            var b = fire(fires[i].x, fires[i].y);
            b.x = fires[i].x;
            b.y = fires[i].y;
            fires2.push(b);
            scene.add(fires2[fires2.length-1]);

        }
    }

    //powerups
    for(var i = 0; i < powerups2.length; i++){
        if(!exists(powerups2[i], powerups)){
            scene.remove(powerups2[i]);
            powerups2.splice(i,1);
        }
    }
    for(var i = 0; i < powerups.length; i++){
        if(!exists(powerups[i], powerups2)){
            var b;
            console.log("adding powerup");
            console.log(powerups[i].t )
            if(powerups[i].t == "extra-life")
                b = createLives(powerups[i].x, powerups[i].y);
            if(powerups[i].t == "speed-boost")
                b = createBoots(powerups[i].x, powerups[i].y);
            if(powerups[i].t == "bomb-strength")
                b = createBombs(powerups[i].x, powerups[i].y);
            if(powerups[i].t == "bomb-boost")
                b = createBombp(powerups[i].x, powerups[i].y);
            if(powerups[i].t == "ghost")
                b = createGhost(powerups[i].x, powerups[i].y);
            console.log(b)
            console.log(powerups[i].t );
            b.x = powerups[i].x;
            b.y = powerups[i].y;
            powerups2.push(b);
            scene.add(powerups2[powerups2.length-1]);

        }
    }


    for(var i = 0; i < players.length; i++){
        if(players[i].lives <= 0){
            if(i==0){scene.remove(p1);}
            if(i==1){scene.remove(p2);}
            if(i==2){scene.remove(p3);}
            if(i==3){scene.remove(p4);}
        }
        if(players[i].ghost > 0 && players[i].id != socket.id){
            players[i].position = {x:-1000, y:-1000};
        }
        if(i == 0){
            
            p1.position.x = grid.length/2 - players[i].position.x;
            p1.position.y = -grid[0].length/2 + players[i].position.y;
            p1.position.z = -10;


       }
       if(i == 1){
            
            p2.position.x = grid.length/2 - players[i].position.x;
            p2.position.y = -grid[0].length/2 + players[i].position.y;
            p2.position.z = -10;


       }
       if(i == 2){
            
            p3.position.x = grid.length/2 - players[i].position.x;
            p3.position.y = -grid[0].length/2 + players[i].position.y;
            p3.position.z = -10;


       }
       if(i == 3){
            
            p4.position.x = grid.length/2 - players[i].position.x;
            p4.position.y = -grid[0].length/2 + players[i].position.y;
            p4.position.z = -10;


       }
        
    }
    if(counter)
        counter.remove();
    if(time/1000  < 3){
       
        counter = createElement("h3", (3 - Math.floor(time/1000)))
        counter.class("counter")
        counter.center();
        counter.position(null, height/8);
    }
    $(".timer").text( "Time: " + formatTime(time));
    
    
    renderer.render(scene, camera);
}

function bomb(x,y){
    var bombGeometry = new THREE.SphereGeometry( 0.3, 32, 32 );
    var bombMaterial = new THREE.MeshPhongMaterial( {color: 0x000000} );
    var mesh =  new THREE.Mesh( bombGeometry, bombMaterial );
    mesh.position.z = -9.7;
    mesh.position.x = grid.length/2 - x - 0.5 ;
    mesh.position.y = -grid[0].length/2 + y + 0.5;
    return mesh;
}

function fire(x,y){
    var fireGeometry = new THREE.BoxGeometry( 1.0, 1.0, 0.01 );

    var mesh =  new THREE.Mesh( fireGeometry, fireMaterial );
    mesh.position.z = -9.99;
    mesh.position.x = grid.length/2 - x - 0.5 ;
    mesh.position.y = -grid[0].length/2 + y + 0.5;
    return mesh;
}
function wall(x,y){
    var wallGeometry = new THREE.BoxGeometry( 1.0, 1.0, 0.6);

    
    var mesh =  new THREE.Mesh( wallGeometry, wallMaterial );
    mesh.position.z = -9.7;
    mesh.position.x =  grid.length/2 - x - 0.5 ;
    mesh.position.y = -grid[0].length/2 + y + 0.5;
    return mesh;
}
function createBox(x,y){
    var boxGeometry = new THREE.BoxGeometry( 1.0, 1.0, 0.6 );
    var mesh =  new THREE.Mesh( boxGeometry, woodMaterial );
    mesh.position.z = -9.7;
    mesh.position.x =  grid.length/2 - x - 0.5 ;
    mesh.position.y = -grid[0].length/2 + y + 0.5;
    return mesh;
}
function createBombs(x,y){
    var boxGeometry = new THREE.BoxGeometry( 0.6, 0.6, 0.6);
    var mesh =  new THREE.Mesh( boxGeometry, bombsMaterial );
    mesh.position.z = -9.7;
    mesh.position.x =  grid.length/2 - x - 0.5 ;
    mesh.position.y = -grid[0].length/2 + y + 0.5;
    return mesh;
}
function createBombp(x,y){
    var boxGeometry = new THREE.BoxGeometry( 0.6, 0.6, 0.6);
    var mesh =  new THREE.Mesh( boxGeometry, bombpMaterial );
    mesh.position.z = -9.7;
    mesh.position.x =  grid.length/2 - x - 0.5 ;
    mesh.position.y = -grid[0].length/2 + y + 0.5;
    return mesh;
}
function createLives(x,y){
    var boxGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6 );
    var mesh =  new THREE.Mesh( boxGeometry, lifeMaterial );
    mesh.position.z = -9.7;
    mesh.position.x =  grid.length/2 - x - 0.5 ;
    mesh.position.y = -grid[0].length/2 + y + 0.5;
    return mesh;
}
function createBoots(x,y){
    var boxGeometry = new THREE.BoxGeometry( 0.6, 0.6, 0.6 );
    var mesh =  new THREE.Mesh( boxGeometry, bootsMaterial );
    mesh.position.z = -9.7;
    mesh.position.x =  grid.length/2 - x - 0.5 ;
    mesh.position.y = -grid[0].length/2 + y + 0.5;
    return mesh;
}
function createGhost(x,y){
    console.log("creating ghost");
    var boxGeometry = new THREE.BoxGeometry( 0.6, 0.6, 0.6 );
    var mesh =  new THREE.Mesh( boxGeometry, ghostMaterial );
    mesh.position.z = -9.7;
    mesh.position.x =  grid.length/2 - x - 0.5 ;
    mesh.position.y = -grid[0].length/2 + y + 0.5;
    return mesh;
}

function exists(item, arr){

    for(var i =0; i < arr.length;  i++){
        if (arr[i].x == item.x && arr[i].y == item.y){
            return true;
        }
    }
    return false;
}
function animate(){
    for(var i =0 ; i < powerups2.length;i++){
        powerups2[i].rotation.z += 0.1;
    }
}