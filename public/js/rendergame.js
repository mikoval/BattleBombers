var counter;
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
        if(players[i].character == "fox")
             img = createImg('/Images/FoxPics/front1.png');
        else if(players[i].character == "bun")
             img = createImg('/Images/bunpics/front1.png');
        else if(players[i].character == "jones")
             img = createImg('/Images/jonespics/front1.png');
        else if(players[i].character == "spear")
             img = createImg('/Images/spearpics/front1.png');
        img.class("score-img score-normal");
        img.id("score-normal"+i)
        img.parent(imgContainer)
        var ghostImg = createImg('/Images/ghost/front1.png');
        ghostImg.class("score-img score-ghost");
        ghostImg.id("score-ghost"+i)
        ghostImg.parent(imgContainer)

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
    draw2D();
}
function drawGame3D(){
    draw3D();
    
}
function exists(item, arr){

    for(var i =0; i < arr.length;  i++){
        if (arr[i].x == item.x && arr[i].y == item.y){
            return true;
        }
    }
    return false;
}