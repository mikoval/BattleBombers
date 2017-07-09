function drawScore(){
    removeElements();
    var centerX = width/2;
    var centerY = height/2;
    var startX = centerX - grid.length/2 * squareSize;
    var startY = centerY - grid[0].length/2 * squareSize;
    
    var scoreBoardLeft = createElement('div');
    scoreBoardLeft.class("left-div");
    scoreBoardLeft.style("width", startX + "px");

    var scoreBoardRight = createElement('div');
    scoreBoardRight.class("right-div");
    scoreBoardRight.style("width", startX + "px");

    var timeItem = createElement('div')
    timeItem.class('time-item score-padding');
    var timer = createElement('h3', "Time: " + formatTime(time));
    timer.class("timer");
    timer.parent(timeItem);
    timeItem.parent(scoreBoardLeft);

    var rightItem = createElement('div')
    rightItem.class('score-padding');
    rightItem.parent(scoreBoardRight);

    for(var i =0; i < players.length; i++){
        var scoreItem = createElement('div')
        scoreItem.class('score-item');
        var playername = players[i].name;
        if ( $.trim(playername) == '' )
            playername = "Player " + (i + 1)
        var name = createElement('h3', playername);
        var score = createElement('p', 'lives: ' + players[i].lives);
        var imgContainer = createElement('div')
        imgContainer.class('img-container')
        var img;
        if(i == 0)
             img = createImg('/Images/FoxPics/front1.png');
        else if(i == 1)
             img = createImg('/Images/bunpics/front1.png');
        else if(i == 2)
             img = createImg('/Images/jonespics/front1.png');
        else if(i == 3)
             img = createImg('/Images/spearpics/front1.png');
        img.class("score-img");
        img.parent(imgContainer)


        name.class('player-name');
        score.class('player-score');

        name.parent(scoreItem);
        score.parent(scoreItem);
        
        imgContainer.parent(scoreItem)
        if(i == 0 || i == 1)
            scoreItem.parent(scoreBoardLeft);
        else
            scoreItem.parent(scoreBoardRight);
    }
   

}
function drawGame(){

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