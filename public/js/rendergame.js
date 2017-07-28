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

        var lives = createElement('p', 'lives: ' + players[i].lives );
        lives.class("score-title");
       

        var speed = createElement('p', 'speed:');
        speed.class("score-title player-score");
        var speedVal = createElement('p',   Math.round(players[i].speed * 100));
        speedVal.class("score-value player-score");
        var speedWrapper = createElement("div");
        speedWrapper.class("score-wrapper");
        speed.parent(speedWrapper);
        speedVal.parent(speedWrapper);

        var mBombs = createElement('p', 'Bombs:');
        mBombs.class("score-title player-score");
        var mBombsVal = createElement('p', players[i].bombMax );
        mBombsVal.class("score-value player-score");
        var mBombsWrapper = createElement("div");
        mBombsWrapper.class("score-wrapper");
        mBombs.parent(mBombsWrapper);
        mBombsVal.parent(mBombsWrapper);

        var sBombs = createElement('p', 'Strength:');
        sBombs.class("score-title player-score");
        var sBombsVal = createElement('p',   players[i].bombStrength);
        sBombsVal.class("score-value player-score");
        var sBombsWrapper = createElement("div");
        sBombsWrapper.class("score-wrapper");
        sBombs.parent(sBombsWrapper);
        sBombsVal.parent(sBombsWrapper);




       
       // var mBombs = createElement('p', 'Bombs: ' + players[i].bombMax);
       // var sBombs = createElement('p', 'Power: ' + players[i].bombStrength);

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
        if(sprites[i].ghost){
            img.class("hidden");
        }
        img.addClass("score-img score-normal");
        img.id("score-normal"+i)
        img.parent(imgContainer)
        var ghostImg = createImg('/Images/ghost/front1.png');
    
        ghostImg.class("score-img");
        if(!sprites[i].ghost){
            ghostImg.addClass("score-ghost");
        }
        ghostImg.id("score-ghost"+i)
        ghostImg.parent(imgContainer)


        name.class('player-name');

        statsWrapper = createElement("div");
        statsWrapper.class("player-stats");
        lives.class('player-score lives');
       

        scoreProfile = createElement('div');
        scoreProfile.class("score-profile");

        name.parent(scoreItem);
       
        
        imgContainer.parent(scoreProfile)
        lives.parent(scoreProfile);
        speedWrapper.parent(statsWrapper);
        mBombsWrapper.parent(statsWrapper);
        sBombsWrapper.parent(statsWrapper);
        statsWrapper.parent (scoreProfile);
        scoreProfile.parent(scoreItem);
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