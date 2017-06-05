function drawScore(){
    removeElements();
    var centerX = width/2;
    var centerY = height/2;
    var startX = centerX - grid.length/2 * squareSize;
    var startY = centerY - grid[0].length/2 * squareSize;
    
    var scoreBoard = createElement('div');
    scoreBoard.class("left-div");
    scoreBoard.style("width", startX + "px");

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
    /*
    var rand = Math.random();
    
    var centerX = width/2;
    var centerY = height/2;
    var startX = centerX - grid.length/2 * squareSize;
    var startY = centerY - grid[0].length/2 * squareSize;
    for(var i = 0; i < grid.length; i++){
        for (var j = 0; j < grid[0].length; j++){
            var x = startX+i*squareSize;
            var y = startY + j * squareSize;
            if(grid[i][j].fireTimer > 0){
                fill("#AA3030")
            }
            else{fill("#A0A0A0")}
            rect(x, y, squareSize, squareSize);
            if(grid[i][j].bomb != undefined){
                image(bomb_img, x, y, squareSize,squareSize);
            }
            if(grid[i][j].wall){
                image(wall_img, x, y, squareSize,squareSize);
            }
            if(grid[i][j].box){
                image(wood_img, x, y, squareSize,squareSize);
            }
        }
    }
    */
    for(var i = 0; i < players.length; i++){
        if(players[i].lives <= 0){}
        else{
            if(i == 0){fill("#FF0000")}
            else if(i == 1){fill("#00FF00")}
            else if(i == 2){fill("#0000FF")}
            else if(i == 3){fill("#FF00FF")}
            else { fill("#000000")}
            var position = players[i].position
            var x = startX + position.x * squareSize;
            var y = startY + position.y * squareSize;
            ellipse(x,y, squareSize*0.6, squareSize * 0.6);
        }
        



    }
}