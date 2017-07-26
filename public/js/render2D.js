function startGame2D(){
    for(var i = 0; i < players.length; i++){
        var s = createSprite(50, 50, squareSize, squareSize);
        setAnimation(s, players[i]);
        sprites.push(s);
    }
        
}
function setAnimation(obj, player){


    if(player.character == "fox"){
        foxAnimation(obj);
    }
    if(player.character == "bun"){
        bunAnimation(obj);
    }
    if(player.character == "jones"){
        jonesAnimation(obj);
    }
    if(player.character == "spear"){
        spearAnimation(obj);
    }
}
function foxAnimation(obj){
    obj.addAnimation("front-true", fox_forward_animation);
    obj.addAnimation("right-true", fox_right_animation);
    obj.addAnimation("left-true", fox_left_animation);
    obj.addAnimation("back-true", fox_back_animation);
    obj.addAnimation("front-false", fox_forward_stand);
    obj.addAnimation("right-false", fox_right_stand);
    obj.addAnimation("left-false", fox_left_stand);
    obj.addAnimation("back-false", fox_back_stand);
}
function bunAnimation(obj){
    obj.addAnimation("front-true", bun_forward_animation);
    obj.addAnimation("right-true", bun_right_animation);
    obj.addAnimation("left-true", bun_left_animation);
    obj.addAnimation("back-true", bun_back_animation);
    obj.addAnimation("front-false", bun_forward_stand);
    obj.addAnimation("right-false", bun_right_stand);
    obj.addAnimation("left-false", bun_left_stand);
    obj.addAnimation("back-false", bun_back_stand);
}
function jonesAnimation(obj){
    obj.addAnimation("front-true", jones_forward_animation);
    obj.addAnimation("right-true", jones_right_animation);
    obj.addAnimation("left-true", jones_left_animation);
    obj.addAnimation("back-true", jones_back_animation);
    obj.addAnimation("front-false", jones_forward_stand);
    obj.addAnimation("right-false", jones_right_stand);
    obj.addAnimation("left-false", jones_left_stand);
    obj.addAnimation("back-false", jones_back_stand);
}
function spearAnimation(obj){
    obj.addAnimation("front-true", spear_forward_animation);
    obj.addAnimation("right-true", spear_right_animation);
    obj.addAnimation("left-true", spear_left_animation);
    obj.addAnimation("back-true", spear_back_animation);
    obj.addAnimation("front-false", spear_forward_stand);
    obj.addAnimation("right-false", spear_right_stand);
    obj.addAnimation("left-false", spear_left_stand);
    obj.addAnimation("back-false", spear_back_stand);
}
function ghostAnimation(obj){
    obj.addAnimation("front-true", ghost_forward_animation);
    obj.addAnimation("right-true", ghost_right_animation);
    obj.addAnimation("left-true", ghost_left_animation);
    obj.addAnimation("back-true", ghost_back_animation);
    obj.addAnimation("front-false", ghost_forward_stand);
    obj.addAnimation("right-false", ghost_right_stand);
    obj.addAnimation("left-false", ghost_left_stand);
    obj.addAnimation("back-false", ghost_back_stand);
}
function draw2D(){

    var centerX = width/2;
    var centerY = height/2;
    var startX = centerX - grid.length/2 * squareSize;
    var startY = centerY - grid[0].length/2 * squareSize;


    $(".timer").text( "Time: " + formatTime(time));
    fill("#A0A0A0")
    for(var i = 0; i < grid.length; i++){
        for (var j = 0; j < grid[0].length; j++){
            var x = startX+i*squareSize;
            var y = startY + j * squareSize;
            rect(x, y, squareSize, squareSize);
            
            
        }
    }

    
    for(var i = 0; i < walls.length; i++){
        var x = startX+walls[i].x*squareSize;
        var y = startY + walls[i].y * squareSize;
        image(wall_img, x, y, squareSize,squareSize);
    }
    for(var i = 0; i < boxes.length; i++){
        var x = startX+boxes[i].x*squareSize;
        var y = startY + boxes[i].y * squareSize;
        image(wood_img, x, y, squareSize,squareSize);
    }
  
    for(var i = 0; i < fires.length; i++){
        var x = startX+fires[i].x*squareSize;
        var y = startY + fires[i].y * squareSize;
        image(fire_img, x, y, squareSize,squareSize);
    }

    for(var i = 0; i < glue.length; i++){
        var x = startX+glue[i].x*squareSize;
        var y = startY + glue[i].y * squareSize;
        image(glue_img, x, y, squareSize,squareSize);
    }
    for(var i = 0; i < bombs.length; i++){
        var x = startX+bombs[i].x*squareSize;
        var y = startY + bombs[i].y * squareSize;
        image(bomb_img, x, y, squareSize,squareSize);
    }
    for(var i = 0; i < powerups.length; i++){
        var x = startX+powerups[i].x*squareSize;
        var y = startY + powerups[i].y * squareSize;
        if(powerups[i].t ==  "bomb-boost")
             image(bomb_p_img, x, y, squareSize,squareSize);
        if(powerups[i].t ==  "speed-boost")
            image(boots_img, x, y, squareSize,squareSize);
        if(powerups[i].t ==  "bomb-strength")
            image(bomb_s_img, x, y, squareSize,squareSize);
        if(powerups[i].t ==  "extra-life")
            image(life_img, x, y, squareSize,squareSize);
        if(powerups[i].t ==  "ghost")
            image(ghost_img, x, y, squareSize,squareSize);
        if(powerups[i].t ==  "glue")
            image(glueP_img, x, y, squareSize,squareSize);

    }



    for(var i = 0; i < players.length; i++){
        if(players[i].ghost > 0 && players[i].id != socket.id){
            players[i].position = {x:-1000, y:-1000};
            continue;
        }
        
        if(players[i].lives <= 0){
            sprites[i].remove();
        }
        else{


            var position = players[i].position


            var x = startX + position.x * squareSize;
            var y = startY + position.y * squareSize;
            
                if (players[i].ghost > 0 && players[i].id == socket.id){
                    if(!sprites[i].ghost){
                        ghostAnimation(sprites[i]);
                        sprites[i].ghost = true;
                        $("#score-ghost"+i).show();
                        $("#score-normal"+i).hide();

                    }

                }
                else{
                    if(sprites[i].ghost){
                        console.log( players[i]);
                        setAnimation(sprites[i], players[i]);
                        sprites[i].ghost = false;
                        $("#score-ghost"+i).hide();
                        $("#score-normal"+i).show();
                    }
                    
                }

                sprites[i].position.x = x;
                sprites[i].position.y = y;
                var dir = players[i].dir
                var moving = players[i].moving
               
                sprites[i].changeAnimation(dir + "-" + moving);
            

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
