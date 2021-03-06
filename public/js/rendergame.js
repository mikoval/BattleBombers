var counter;
function initScore(){
    removeElements();

    
    var centerX = width/2;
    var centerY = height/2;
    startX = centerX - grid.length/2 * squareSize;
    startY = centerY - grid[0].length/2 * squareSize;
    if(startX < 250){
        console.log('returning')
        return;
    }
    
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
        lives.id("lives-"+i);
       

        var speed = createElement('p', 'speed:');
        speed.class("score-title player-score");
        var speedVal = createElement('p',   Math.round(players[i].speed * 100));
        speedVal.class("score-value player-score");
        speedVal.id("speed-"+i);
        var speedWrapper = createElement("div");
        speedWrapper.class("score-wrapper");
        speed.parent(speedWrapper);
        speedVal.parent(speedWrapper);

        var mBombs = createElement('p', 'Bombs:');
        mBombs.class("score-title player-score");
        var mBombsVal = createElement('p', players[i].bombMax );
        mBombsVal.class("score-value player-score");
        mBombsVal.id("mBombs-"+i);
        var mBombsWrapper = createElement("div");
        mBombsWrapper.class("score-wrapper");
        mBombs.parent(mBombsWrapper);
        mBombsVal.parent(mBombsWrapper);

        var sBombs = createElement('p', 'Strength:');
        sBombs.class("score-title player-score");
        var sBombsVal = createElement('p',   players[i].bombStrength);
        sBombsVal.class("score-value player-score");
        sBombsVal.id("sBombs-"+i);
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
        if(playerSprites[i].ghost){
            img.class("hidden");
        }
        img.addClass("score-img score-normal");
        img.id("score-normal"+i)
        img.parent(imgContainer)
        var ghostImg = createImg('/Images/ghost/front1.png');
    
        ghostImg.class("score-img");
        if(!playerSprites[i].ghost){
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

        var scorePowerups = createElement("div");
        scorePowerups.class("score-powerups")
        scorePowerups.parent(scoreItem);
        var glueWrapper = createElement('div');
        glueWrapper.class("powerup-wrapper");
        var scoreGlue = createImg('/Images/glue.png');
        scoreGlue.class("score-powerup");
        scoreGlue.parent(glueWrapper);
        glueText = createElement('p', "0");
        glueText.id("glue-"+i);
        glueText.class('powerups-text');
        glueText.parent(glueWrapper);

     
        var bombWrapper = createElement('div');
        bombWrapper.class("powerup-wrapper");
        var scoreBomb = createImg('/Images/Bomb.png');
        scoreBomb.class("score-powerup");
        scoreBomb.parent(bombWrapper);
        bombText = createElement('p', "0");
        bombText.id("bomb-"+i);
        bombText.class('powerups-text');
        bombText.parent(bombWrapper);


        var mineWrapper = createElement('div');
        mineWrapper.class("powerup-wrapper");
        var scoreMine = createImg('/Images/mineP.png');
        scoreMine.class("score-powerup");
        scoreMine.parent(mineWrapper);
        mineText = createElement('p', "0");
        mineText.id("mine-"+i);
        mineText.class('powerups-text');
        mineText.parent(mineWrapper);


        bombWrapper.parent(scorePowerups);

        glueWrapper.parent(scorePowerups);

        mineWrapper.parent(scorePowerups);

        if(i == 0 || i == 1)
            scoreItem.parent(scoreBoardLeft);
        else
            scoreItem.parent(scoreBoardRight);
    }
}
function drawScore(){
    if(startX < 250){
        return;
    }
    for(var i = 0; i < players.length; i++){
        $("#lives-"+i).text(players[i].lives);
        $("#speed-"+i).text(Math.round(players[i].speed * 100));
        $("#mBombs-"+i).text(players[i].bombMax);
        $("#sBombs-"+i).text(players[i].bombStrength);

        $("#bomb-"+i).text(players[i].bombsRemaining);
        $("#glue-"+i).text(players[i].glue);
        $("#mine-"+i).text(players[i].mines);



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