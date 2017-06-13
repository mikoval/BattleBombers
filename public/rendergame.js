function drawScore(){
    removeElements();
    var centerX = width/2;
    var centerY = height/2;
    var startX = centerX - grid.length/2 * squareSize;
    var startY = centerY - grid[0].length/2 * squareSize;
    
    var scoreBoard = createElement('div');
    scoreBoard.class("left-div");
    scoreBoard.style("width", startX + "px");

    var timeItem = createElement('div')
    timeItem.class('time-item');
    var timer = createElement('h3', "Time: " + formatTime(time));
    timer.class("timer");
    timer.parent(timeItem);
    timeItem.parent(scoreBoard);
    for(var i =0; i < players.length; i++){
        var scoreItem = createElement('div')
        scoreItem.class('score-item');
        var name = createElement('h3', players[i].name);
        var score = createElement('p', 'lives: ' + players[i].lives);
        name.class('player-name');
        score.class('player-score');
        name.parent(scoreItem);
        score.parent(scoreItem);
        scoreItem.parent(scoreBoard);
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
            else if( grid[i][j].obj == "bomb")
            {
                
                image(bomb_img, x, y, squareSize,squareSize);
            }
        }
    }
    
    for(var i = 0; i < players.length; i++){
        if(players[i].lives <= 0){}
        else{
            
            var position = players[i].position
            var x = startX + position.x * squareSize;
            var y = startY + position.y * squareSize;
            if(i == 0){
                p1.position.x = x;
                p1.position.y = y;
                var dir = players[i].direction
                var moving = players[i].moving
                console.log(dir)
                p1.changeAnimation(dir + "-" + moving);
            }
            else if(i == 1){
                p2.position.x = x;
                p2.position.y = y;
                var dir = players[i].direction
                var moving = players[i].moving
                p2.changeAnimation(dir + "-" + moving);
            }
            else if(i == 2){fill("#0000FF")}
            else if(i == 3){fill("#FF00FF")}
            else { fill("#000000")}
            

            //ellipse(x,y, squareSize*1, squareSize * 1);
        }
        


        
    }
    drawSprites();
}