function startGame2D(){
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
function draw2D(){

    var centerX = width/2;
    var centerY = height/2;
    var startX = centerX - grid.length/2 * squareSize;
    var startY = centerY - grid[0].length/2 * squareSize;


    $(".timer").text( "Time: " + formatTime(time));
    
    for(var i = 0; i < grid.length; i++){
        for (var j = 0; j < grid[0].length; j++){
            var x = startX+i*squareSize;
            var y = startY + j * squareSize;
            if(grid[i][j].floor == "_"){
                fill("#A0A0A0")
                rect(x, y, squareSize, squareSize);
            }
            else if (grid[i][j].floor == "fire")
            {
                fill("#AA3030")
                rect(x, y, squareSize, squareSize);
            }    
            else if( grid[i][j].floor == "wall")
            {
                image(wall_img, x, y, squareSize,squareSize);
            }
            else if( grid[i][j].floor == "box")
            {
                image(wood_img, x, y, squareSize,squareSize);
            }
            if( grid[i][j].obj == "speed-boost")
            {
                
                image(boots_img, x, y, squareSize,squareSize);
            }
            else if( grid[i][j].obj == "bomb-boost")
            {
                
                image(bomb_p_img, x, y, squareSize,squareSize);
            }
            else if( grid[i][j].obj == "bomb-strength")
            {
                
                image(bomb_s_img, x, y, squareSize,squareSize);
            }
            else if( grid[i][j].obj == "extra-life")
            {
                image(life_img, x, y, squareSize,squareSize);
            }
            else if( grid[i][j].obj == "bomb")
            {
                image(bomb_img, x, y, squareSize,squareSize);
            }
            else if( grid[i][j].obj == "ghost")
            {
                image(ghost_img, x, y, squareSize,squareSize);
            }
        }
    }
    
    for(var i = 0; i < players.length; i++){
        if(players[i].ghost > 0 && players[i].id != socket.id){
            players[i].position = {x:-1000, y:-1000};
        }
        if(players[i].lives <= 0){
            if(i == 0){p1.remove()}
            if(i == 1){p2.remove()}
            if(i == 2){p3.remove()}
            if(i == 3){p4.remove()}
        }
        else{
            
            var position = players[i].position


            var x = startX + position.x * squareSize;
            var y = startY + position.y * squareSize;
            
            if(i == 0){
                p1.position.x = x;
                p1.position.y = y;
                var dir = players[i].dir
                var moving = players[i].moving
               
                p1.changeAnimation(dir + "-" + moving);
            }
            else if(i == 1){
                p2.position.x = x;
                p2.position.y = y;
                var dir = players[i].dir
                var moving = players[i].moving
                p2.changeAnimation(dir + "-" + moving);
            }
            else if(i == 2){
                p3.position.x = x;
                p3.position.y = y;
                var dir = players[i].dir
                var moving = players[i].moving
                p3.changeAnimation(dir + "-" + moving);
            }
            else if(i == 3){
                p4.position.x = x;
                p4.position.y = y;
                var dir = players[i].dir
                var moving = players[i].moving
                p4.changeAnimation(dir + "-" + moving);
            }
            

        }
        


        
    }
    drawSprites();
    if(time/1000  < 3){
        textSize(600);
        fill("#FFFFFF")
        textAlign(CENTER);
        text(3 - Math.floor(time/1000), width/2, 2*height/3);
    }
    drawn = true;
}
function animate(){
    for(var i =0 ; i < powerups.length;i++){
        powerups[i].rotation.z += 0.1;
    }
}