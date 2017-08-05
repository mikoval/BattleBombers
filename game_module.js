var boardModule = require('./board_module.js');
var enemyModule = require('./enemy_module.js');
var radius = 0.5;
module.exports = {
	load: function(players, grid, type){
		//if(type == "ice-full"|| type == "ice-maze"){
		//	return new this.randomItems(players, grid);
		//}
		return new this.twoMinBombs(players, grid, type);
	},
    twoMinBombs: function(players, grid, type){
        this.players = players;
        this.grid = grid;
        this.type = type;
        this.startTime = new Date();
        this.currentTime = new Date();
        

        this.update = function(){
        	this.updateBombs();
        	this.updatePosition();
        	this.updateEnemies();
        	
        }
        this.setEnemies = function(){
        	var arr = []
        	for(var x = 0; x  < grid.length; x++){
	            for(var y = 0; y < grid[0].length; y++){
	            	if(grid[x][y].squirrelStart == true){
	            		arr.push(new enemyModule.squirrel(x, y));
	            		grid[x][y].squirrelStart = undefined;
	            	}
	            }
	        }
	        return arr;
        }
        this.enemies = this.setEnemies();
        this.active = function(){
    		var alive = 0
        	for(var i= 0; i < this.players.length; i++){
        		if(this.players[i].character.lives >= 1){
        			alive++;
        		}
        	}
        	if(alive>1){
        		return true;
        	}
        	return false;
        }
        this.winner = function(){
        	var winner = "Tie";
            for(var j = 0; j < this.players.length; j++){
                if(this.players[j].character.lives >= 1){
                    winner = this.players[j].name;
                }
            }
            return winner;
        }
        this.compress = function(){
        	return compress(this);
        }
        this.updateEnemies = function(){
        	for(var i = 0; i < this.enemies.length; i++){
        		this.enemies[i].update(this.grid);
        	}
        }
        this.updateBombs = function(){
        	for(var x = 0; x  < grid.length; x++){
	            for(var y = 0; y < grid[0].length; y++){
	                if(grid[x][y].bomb != undefined){
	                    grid[x][y].bomb.timer -= 0.008;
	                    if(grid[x][y].bomb.timer <= 0 ){
	                        explodeBomb(grid, x, y) 
	                    }
	                    
	                }
	            }
	        }
	        for(var x = 0; x  < grid.length; x++){
	            for(var y = 0; y < grid[0].length; y++){
	                if(grid[x][y].fireTimer >= 0){
	                    grid[x][y].fireTimer -= .1;
	                }
	                if(grid[x][y].bush && grid[x][y].bush.timer >= 0){
	                    grid[x][y].bush.timer -= .0003;
	                }
	                
	                if(grid[x][y].box && grid[x][y].fireTimer > 0){
	                    grid[x][y].box = false;
	                    grid[x][y].fireTimer = -1
	                }
	                if(grid[x][y].bush  && grid[x][y].fireTimer > 0){
	                    grid[x][y].bush.timer = 1.0;
	                    //grid[x][y].fireTimer = -1
	                }
	                if(grid[x][y].mine != undefined && grid[x][y].mine > 0){
	                    grid[x][y].mine -= 0.01;
	                }
	                if(grid[x][y].glue != undefined && grid[x][y].glue > 0){
	                    grid[x][y].glue -= 0.03;
	                }
	                
	            }
	        }
        }
        this.updatePosition = function(){

		        var players = this.players;
		        var grid = this.grid;
		        var time = (new Date()) - this.startTime ;
		        this.currentTime = time;
		        var timer = time /1000
		        if(timer < 3){
		            return;
		        }
		        timer  = timer / 60
		        if(timer > 2){
		            addBomb(grid, (timer -2 ) /10 + 1);
		            addItem(grid);
		        }
		        var alivePlayers = 0
		    
		        for(var j = 0; j < players.length; j++){
		            
		            var player = players[j]
		            if(player.character.lives <= 0){ continue;}
		            alivePlayers += 1;
		            var position = player.character.position;
		            var direction = player.direction;
		            
		            var x = Math.floor(position.x);
		            var y = Math.floor(position.y);
		            if(grid[x][y].boots){
		                player.character.speed += 0.01;
		                if(player.character.speed > 0.15){
		                    player.character.speed = 0.15;
		                }
		                grid[x][y].boots = false;
		               
		            }
		            if(grid[x][y].bombP){
		                player.character.bombMax += 1;
		                grid[x][y].bombP = false;
		            
		            }
		            if(grid[x][y].bombS){
		                player.character.bombStrength += 1;
		                grid[x][y].bombS = false;
		             
		            }
		            if(grid[x][y].lifeP){
		                player.character.lives += 1;
		                grid[x][y].lifeP = false;
		               
		            }
		            if(grid[x][y].ghost){
		                player.character.ghost = 3.0;
		                grid[x][y].ghost = false;
		            }
		            if(grid[x][y].glueP){
		                player.character.glue += 3;
		                grid[x][y].glueP = false;
		               
		            }
		            if(grid[x][y].mineP){
		                player.character.mines += 1;
		                grid[x][y].mineP = false;
		            }

		            x = position.x;
		            y = position.y;


		            if(player.character.invulnerable >= 0){ player.character.invulnerable -= 0.01;}
		            if(player.character.ghost >= 0){ player.character.ghost -= 0.01;}
		            if(grid[Math.floor(position.x)][Math.floor(position.y)].mine < 0){
		                grid[Math.floor(position.x)][Math.floor(position.y)].mine = undefined;
		                grid[Math.floor(position.x)][Math.floor(position.y)].fireTimer = 1.0;
		          
		            }
		            if(grid[Math.floor(position.x)][Math.floor(position.y)].fireTimer >= 0 && player.character.invulnerable < 0){
		                player.character.lives -= 1;
		                
		                player.character.invulnerable = 1;
		          
		            }
		            ///////////
		            var speed = player.character.speed;
		            if(grid[Math.floor(position.x)][Math.floor(position.y)].glue < 0){
		                speed = 0.03;
		            }
		            var prev = undefined ;
		            if(grid[Math.floor(position.x)][Math.floor(position.y)].type == "ice")
		                prev = player.character.prevMove;
		            
		            if(direction.up){
		                player.character.dir = "back"
		            }
		            else if(direction.down){
		                player.character.dir = "front"
		            }
		            else if(direction.right){
		                player.character.dir = "right"
		            }
		            else if(direction.left){
		                player.character.dir = "left"
		            }
		            if(direction.up && prev == undefined || prev == "up" ){
		                player.character.moving = true;
		                
		                player.character.prevMove = "up"

		                var cx = position.x - Math.floor(position.x)
		                if(cx!= 0.5){
		                    if(cx < 0.5){
		                        if(cx + speed > 0.6){
		                            position.x = position.x + (0.5 - cx);
		                        }
		                        else{
		                            position.x = position.x +  speed;
		                        }
		                    }
		                    else{
		                        if(cx - speed < 0.5){
		                            position.x = position.x - (cx- 0.5);
		                        }
		                        else{
		                            position.x = position.x - speed;
		                        }
		                    }
		                }
		                else{
		                    var ny = position.y -speed;
		                    var nx = position.x;
		                    if(canMove(nx, ny ,  x ,y, grid))
		                        position.y = position.y - speed
		                     else{
		                        player.character.prevMove = undefined;
		                    }
		                }
		                
		            }
		            else if(direction.down && prev == undefined || prev == "down" ){
		                player.character.moving = true;
		              
		                player.character.prevMove = "down"
		                var cx = position.x - Math.floor(position.x)

		                if(cx!= 0.5){
		                    if(cx < 0.5){
		                        if(cx + speed > 0.5){
		                            position.x = position.x + (0.5 - cx);
		                        }
		                        else{
		                            position.x = position.x +  speed;
		                        }
		                    }
		                    else{
		                        if(cx - speed < 0.5){
		                            position.x = position.x - (cx- 0.5);
		                        }
		                        else{
		                            position.x = position.x -speed;
		                        }
		                    }
		                }
		                else{
		                    var ny = position.y + speed;
		                    var nx = position.x;
		                    if(canMove(nx, ny ,  x ,y, grid))
		                        position.y = position.y + speed
		                     else{
		                        player.character.prevMove = undefined;
		                    }
		                }
		            }
		            else if(direction.right && prev == undefined || prev == "right" ){
		                player.character.moving = true;
		            
		                player.character.prevMove = "right"
		                var cy = position.y - Math.floor(position.y)

		                if(cy!= 0.5){
		                    if(cy < 0.5){
		                        if(cy + speed > 0.5){
		                            position.y = position.y + (0.5 - cy);
		                        }
		                        else{
		                            position.y = position.y +  speed;
		                        }
		                    }
		                    else{
		                        if(cy - speed < 0.5){
		                            position.y = position.y - (cy- 0.5);
		                        }
		                        else{
		                            position.y = position.y - speed;
		                        }
		                    }
		                }
		                else{
		                    var ny = position.y ;
		                    var nx = position.x + speed;
		                    if(canMove(nx, ny ,  x ,y, grid))
		                        position.x = position.x + speed
		                     else{
		                        player.character.prevMove = undefined;
		                    }
		                }
		            }
		            else  if(direction.left && prev == undefined || prev == "left" ){

		                player.character.moving = true;

		                player.character.prevMove = "left"
		                var cy = position.y - Math.floor(position.y)
		                if(cy!= 0.5){
		                    if(cy < 0.5){
		                        if(cy + speed > 0.5){
		                            position.y = position.y + (0.5 - cy);
		                        }
		                        else{
		                            position.y = position.y +  speed;
		                        }
		                    }
		                    else{
		                        if(cy - speed < 0.5){
		                            position.y = position.y - (cy- 0.5);
		                        }
		                        else{
		                            position.y = position.y - speed;
		                        }
		                    }
		                }
		                else{
		                    var ny = position.y ;
		                    var nx = position.x -speed;
		                    if(canMove(nx, ny ,  x ,y, grid))
		                        position.x = position.x - speed
		                    else{
		                        player.character.prevMove = undefined;
		                    }
		                }
		            }
		            else{
		                player.character.prevMove = undefined;
		                player.character.moving = false;
		            }
		            if(direction.bomb){

		                if(player.character.bombCount < player.character.bombMax  &&  grid[Math.floor(position.x)][Math.floor(position.y)].bomb == undefined){
		         
		                    grid[Math.floor(position.x)][Math.floor(position.y)].bomb = {player: player, timer: 1, active: true, strength: player.character.bombStrength}
		                    player.character.bombCount +=1;
		                }
		                direction.bomb = false;
		            }
		            if(direction.glue){
		                if(player.character.glue  > 0  &&  grid[Math.floor(position.x)][Math.floor(position.y)].glue == undefined){
		                    grid[Math.floor(position.x)][Math.floor(position.y)].glue = 1.0;
		                    player.character.glue -=1;
		                }
		                direction.glue = false;
		            }
		            if(direction.mine){
		                if(player.character.mines  > 0  &&  grid[Math.floor(position.x)][Math.floor(position.y)].mine == undefined){
		                    grid[Math.floor(position.x)][Math.floor(position.y)].mine = 1.0;
		                    player.character.mines -=1;
		                }
		                direction.mine = false;
		            }

		        }
		        

		        
		            
		        
		        
		    
        } 
    },
    randomItems: function(players, grid){
        this.players = players;
        this.grid = grid;
        this.startTime = new Date();
        this.currentTime = new Date();
        this.update = function(){
        	this.updateBombs();
        	this.updatePosition();
        	
        }
        this.active = function(){
    		var alive = 0
        	for(var i= 0; i < this.players.length; i++){
        		if(this.players[i].character.lives >= 1){
        			alive++;
        		}
        	}
        	if(alive>1){
        		return true;
        	}
        	return false;
        }
        this.winner = function(){
        	var winner = "Tie";
            for(var j = 0; j < this.players.length; j++){
                if(this.players[j].character.lives >= 1){
                    winner = this.players[j].name;
                }
            }
        }
        this.compress = function(){
        	return compress(this);
        }
        this.updateBombs = function(){
        	for(var x = 0; x  < grid.length; x++){
	            for(var y = 0; y < grid[0].length; y++){
	                if(grid[x][y].bomb != undefined){
	                    grid[x][y].bomb.timer -= 0.01;
	                    if(grid[x][y].bomb.timer <= 0 ){
	                        explodeBomb(grid, x, y) 
	                    }
	                    
	                }
	            }
	        }
	        for(var x = 0; x  < grid.length; x++){
	            for(var y = 0; y < grid[0].length; y++){
	                if(grid[x][y].fireTimer >= 0){
	                    grid[x][y].fireTimer -= .1;
	                }
	                if(grid[x][y].bush && grid[x][y].bush.timer >= 0){
	                    grid[x][y].bush.timer -= .01;
	                }
	                
	                if(grid[x][y].box && grid[x][y].fireTimer > 0){
	                    grid[x][y].box = false;
	                    grid[x][y].fireTimer = -1
	                }
	                if(grid[x][y].bush  && grid[x][y].fireTimer > 0){
	                    grid[x][y].bush.timer = 1.0;
	                    //grid[x][y].fireTimer = -1
	                }
	                if(grid[x][y].mine != undefined && grid[x][y].mine > 0){
	                    grid[x][y].mine -= 0.03;
	                }
	                if(grid[x][y].glue != undefined && grid[x][y].glue > 0){
	                    grid[x][y].glue -= 0.1;
	                }
	                
	            }
	        }
        }
        this.updatePosition = function(){

		        var players = this.players;
		        var grid = this.grid;
		        var time = (new Date()) - this.startTime ;
		        this.currentTime = time;
		        var timer = time /1000
		        if(timer < 3){
		            return;
		        }
		        timer  = timer / 60
		        
		        addItem(grid);
		        
		        var alivePlayers = 0
		    
		        for(var j = 0; j < players.length; j++){
		            
		            var player = players[j]
		            if(player.character.lives <= 0){ continue;}
		            alivePlayers += 1;
		            var position = player.character.position;
		            var direction = player.direction;
		            
		            var x = Math.floor(position.x);
		            var y = Math.floor(position.y);
		            if(grid[x][y].boots){
		                player.character.speed += 0.01;
		                if(player.character.speed > 0.15){
		                    player.character.speed = 0.15;
		                }
		                grid[x][y].boots = false;
		               
		            }
		            if(grid[x][y].bombP){
		                player.character.bombMax += 1;
		                grid[x][y].bombP = false;
		            
		            }
		            if(grid[x][y].bombS){
		                player.character.bombStrength += 1;
		                grid[x][y].bombS = false;
		             
		            }
		            if(grid[x][y].lifeP){
		                player.character.lives += 1;
		                grid[x][y].lifeP = false;
		               
		            }
		            if(grid[x][y].ghost){
		                player.character.ghost = 3.0;
		                grid[x][y].ghost = false;
		            }
		            if(grid[x][y].glueP){
		                player.character.glue += 3;
		                grid[x][y].glueP = false;
		               
		            }
		            if(grid[x][y].mineP){
		                player.character.mines += 1;
		                grid[x][y].mineP = false;
		            }

		            x = position.x;
		            y = position.y;


		            if(player.character.invulnerable >= 0){ player.character.invulnerable -= 0.01;}
		            if(player.character.ghost >= 0){ player.character.ghost -= 0.01;}
		            if(grid[Math.floor(position.x)][Math.floor(position.y)].mine < 0){
		                grid[Math.floor(position.x)][Math.floor(position.y)].mine = undefined;
		                grid[Math.floor(position.x)][Math.floor(position.y)].fireTimer = 1.0;
		          
		            }
		            if(grid[Math.floor(position.x)][Math.floor(position.y)].fireTimer >= 0 && player.character.invulnerable < 0){
		                player.character.lives -= 1;
		                
		                player.character.invulnerable = 1;
		          
		            }
		            ///////////
		            var speed = player.character.speed;
		            if(grid[Math.floor(position.x)][Math.floor(position.y)].glue < 0){
		                speed = 0.03;
		            }
		            var prev = undefined ;
		            if(grid[Math.floor(position.x)][Math.floor(position.y)].type == "ice")
		                prev = player.character.prevMove;
		            
		            if(direction.up){
		                player.character.dir = "back"
		            }
		            else if(direction.down){
		                player.character.dir = "front"
		            }
		            else if(direction.right){
		                player.character.dir = "right"
		            }
		            else if(direction.left){
		                player.character.dir = "left"
		            }
		            if(direction.up && prev == undefined || prev == "up" ){
		                player.character.moving = true;
		                
		                player.character.prevMove = "up"

		                var cx = position.x - Math.floor(position.x)
		                if(cx!= 0.5){
		                    if(cx < 0.5){
		                        if(cx + speed > 0.6){
		                            position.x = position.x + (0.5 - cx);
		                        }
		                        else{
		                            position.x = position.x +  speed;
		                        }
		                    }
		                    else{
		                        if(cx - speed < 0.5){
		                            position.x = position.x - (cx- 0.5);
		                        }
		                        else{
		                            position.x = position.x - speed;
		                        }
		                    }
		                }
		                else{
		                    var ny = position.y -speed;
		                    var nx = position.x;
		                    if(canMove(nx, ny ,  x ,y, grid))
		                        position.y = position.y - speed
		                     else{
		                        player.character.prevMove = undefined;
		                    }
		                }
		                
		            }
		            else if(direction.down && prev == undefined || prev == "down" ){
		                player.character.moving = true;
		              
		                player.character.prevMove = "down"
		                var cx = position.x - Math.floor(position.x)

		                if(cx!= 0.5){
		                    if(cx < 0.5){
		                        if(cx + speed > 0.5){
		                            position.x = position.x + (0.5 - cx);
		                        }
		                        else{
		                            position.x = position.x +  speed;
		                        }
		                    }
		                    else{
		                        if(cx - speed < 0.5){
		                            position.x = position.x - (cx- 0.5);
		                        }
		                        else{
		                            position.x = position.x -speed;
		                        }
		                    }
		                }
		                else{
		                    var ny = position.y + speed;
		                    var nx = position.x;
		                    if(canMove(nx, ny ,  x ,y, grid))
		                        position.y = position.y + speed
		                     else{
		                        player.character.prevMove = undefined;
		                    }
		                }
		            }
		            else if(direction.right && prev == undefined || prev == "right" ){
		                player.character.moving = true;
		            
		                player.character.prevMove = "right"
		                var cy = position.y - Math.floor(position.y)

		                if(cy!= 0.5){
		                    if(cy < 0.5){
		                        if(cy + speed > 0.5){
		                            position.y = position.y + (0.5 - cy);
		                        }
		                        else{
		                            position.y = position.y +  speed;
		                        }
		                    }
		                    else{
		                        if(cy - speed < 0.5){
		                            position.y = position.y - (cy- 0.5);
		                        }
		                        else{
		                            position.y = position.y - speed;
		                        }
		                    }
		                }
		                else{
		                    var ny = position.y ;
		                    var nx = position.x + speed;
		                    if(canMove(nx, ny ,  x ,y, grid))
		                        position.x = position.x + speed
		                     else{
		                        player.character.prevMove = undefined;
		                    }
		                }
		            }
		            else  if(direction.left && prev == undefined || prev == "left" ){

		                player.character.moving = true;

		                player.character.prevMove = "left"
		                var cy = position.y - Math.floor(position.y)
		                if(cy!= 0.5){
		                    if(cy < 0.5){
		                        if(cy + speed > 0.5){
		                            position.y = position.y + (0.5 - cy);
		                        }
		                        else{
		                            position.y = position.y +  speed;
		                        }
		                    }
		                    else{
		                        if(cy - speed < 0.5){
		                            position.y = position.y - (cy- 0.5);
		                        }
		                        else{
		                            position.y = position.y - speed;
		                        }
		                    }
		                }
		                else{
		                    var ny = position.y ;
		                    var nx = position.x -speed;
		                    if(canMove(nx, ny ,  x ,y, grid))
		                        position.x = position.x - speed
		                    else{
		                        player.character.prevMove = undefined;
		                    }
		                }
		            }
		            else{
		                player.character.prevMove = undefined;
		                player.character.moving = false;
		            }
		            if(direction.bomb){

		                if(player.character.bombCount < player.character.bombMax  &&  grid[Math.floor(position.x)][Math.floor(position.y)].bomb == undefined){
		         
		                    grid[Math.floor(position.x)][Math.floor(position.y)].bomb = {player: player, timer: 1, active: true, strength: player.character.bombStrength}
		                    player.character.bombCount +=1;
		                }
		                direction.bomb = false;
		            }
		            if(direction.glue){
		                if(player.character.glue  > 0  &&  grid[Math.floor(position.x)][Math.floor(position.y)].glue == undefined){
		                    grid[Math.floor(position.x)][Math.floor(position.y)].glue = 1.0;
		                    player.character.glue -=1;
		                }
		                direction.glue = false;
		            }
		            if(direction.mine){
		                if(player.character.mines  > 0  &&  grid[Math.floor(position.x)][Math.floor(position.y)].mine == undefined){
		                    grid[Math.floor(position.x)][Math.floor(position.y)].mine = 1.0;
		                    player.character.mines -=1;
		                }
		                direction.mine = false;
		            }

		        }
		        

		        
		            
		        
		        
		    
        } 
    }
    
}
function explodeBomb(grid, x, y){
    var bomb = grid[x][y].bomb
    if(bomb.player)
        grid[x][y].bomb.player.character.bombCount -= 1;
    grid[x][y].bomb = undefined;
    for(var k = 0; k <= bomb.strength; k++){
        
        if(grid[x + k][y].wall)
            break; 
         
        if(grid[x+k][y].bomb){
            explodeBomb(grid, x+k, y);
            break;
        }
        grid[x+k][y].fireTimer = 1;  
        if(grid[x + k][y].box)
            break;
    }
    for(var k = 0; k <= bomb.strength; k++){
        
        if(grid[x - k][y].wall)
            break; 
        
        if(grid[x-k][y].bomb){
            explodeBomb(grid, x-k, y);
        }
        grid[x-k][y].fireTimer = 1; 
        if(grid[x - k][y].box)
            break;  
    }
    for(var k = 0; k <= bomb.strength; k++){
        
        if(grid[x][y + k].wall)
            break; 
        
        if(grid[x][y+k].bomb){
            explodeBomb(grid, x, y+k);
        }
        grid[x][y + k].fireTimer = 1;  
        if(grid[x ][y+k].box)
            break; 
    }
    for(var k = 0; k <= bomb.strength; k++){
        
        if(grid[x][y -k].wall)
            break;
        
        if(grid[x][y-k].bomb){
            explodeBomb(grid, x, y-k);
        } 
        grid[x][y-k].fireTimer = 1; 
        if(grid[x ][y-k].box)
            break;  
    }

}
function canMove(nx, ny, x, y, grid){
    var onBomb = [];

    var current0 = grid[Math.floor(x)][Math.floor(y)]
    var current1 = grid[Math.floor(x+ radius * 0.9)][Math.floor(y)]
    var current2 = grid[Math.floor(x- radius * 0.9)][Math.floor(y)]
    var current3 = grid[Math.floor(x)][Math.floor(y+ radius * 0.9)]
    var current4 = grid[Math.floor(x)][Math.floor(y- radius * 0.9)]
    if(current0.bomb){
        onBomb.push( current0);
    }
    if(current1.bomb){
        onBomb.push( current1);
    }
    if(current2.bomb){
        onBomb.push( current2);
    }
    if(current3.bomb){
        onBomb.push( current3);
    }
    if(current4.bomb){
        onBomb.push( current4);
    }
    

    var cell1 = grid[Math.floor(nx + radius * 0.9)][Math.floor(ny)]
    var cell2 = grid[Math.floor(nx - radius * 0.9)][Math.floor(ny)]
    var cell3 = grid[Math.floor(nx)][Math.floor(ny + radius * 0.9)]
    var cell4 = grid[Math.floor(nx)][Math.floor(ny - radius * 0.9)]
    var current = false

    if(cell1.wall || cell1.box || ( (cell1.bomb && onBomb.length == 0)  || (cell1.bomb && !containsObject(cell1, onBomb))) ){
        return false;
    }
    if(cell2.wall || cell2.box ||  ( (cell2.bomb && onBomb.length == 0)  || (cell2.bomb && !containsObject(cell2, onBomb)))  ){
        return false;
    }
    if(cell3.wall || cell3.box ||  ( (cell3.bomb && onBomb.length == 0)  || (cell3.bomb && !containsObject(cell3, onBomb)))  ){
        return false;
    }
    if(cell4.wall || cell4.box ||  ( (cell4.bomb && onBomb.length == 0)  || (cell4.bomb && !containsObject(cell4, onBomb)))  ){
        return false;
    }
    
    return true;
}
function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i] === obj) {
            return true;
        }
    }

    return false;
}
function distance(c1, c2){
    return Math.pow(Math.pow((c1.x - c2.x),2) + Math.pow((c1.y - c2.y),2) , 0.5);
}
function compress(game){
    var grid = game.grid;
    var players = game.players;
    var time = game.currentTime;
    var enemies = game.enemies;


    var minPlayers = new Array(players.length);
    for( var i = 0; i < players.length; i++){
        minPlayers[i] = {
            p: players[i].character.position, l: players[i].character.lives, d:players[i].character.dir, 
            m: players[i].character.moving, n: players[i].name, br: (players[i].character.bombMax - players[i].character.bombCount),
            gh:players[i].character.ghost, id:players[i].id, ch:players[i].sprite, gl: players[i].character.glue, 
            sp:players[i].character.speed, bs:players[i].character.bombStrength, bm:players[i].character.bombMax, mi: players[i].character.mines
        }
    }
    var minEnemies= new Array(enemies.length);
    for( var i = 0; i < enemies.length; i++){
        minEnemies[i] = {
            p: enemies[i].position, d:enemies[i].dir, t:enemies[i].type, m: enemies[i].moving
        }
    }
    var walls = [];
    var boxes = [];
    var fire = [];
    var bombs = [];
    var powerups = [];
    var glue = [];
    var mines = [];
    var bushes = [];
    for( var i = 0; i < grid.length; i++){
        for( var j = 0; j < grid[0].length; j++){
      
            if(grid[i][j].fireTimer >= 0){fire.push({x:i, y:j})}
     
            else if(grid[i][j].box)     {boxes.push({x:i, y:j})}

            if(grid[i][j].bush){bushes.push({x:i, y:j, t:grid[i][j].bush.timer})}


            if(grid[i][j].bomb){bombs.push({x:i, y:j})}

            if(grid[i][j].glue){glue.push({x:i, y:j})}
            if(grid[i][j].mine!= undefined){mines.push({x:i, y:j, time: grid[i][j].mine})}
    

            else if(!grid[i][j].box && grid[i][j].bombP){powerups.push({x:i, y:j, t:"bb"})}
            else if(!grid[i][j].box && grid[i][j].boots){powerups.push({x:i, y:j, t:"sb"})}
            else if(!grid[i][j].box && grid[i][j].bombS){powerups.push({x:i, y:j, t:"bs"})}
            else if(!grid[i][j].box && grid[i][j].lifeP){powerups.push({x:i, y:j, t:"el"})}
            else if(!grid[i][j].box && grid[i][j].ghost){powerups.push({x:i, y:j, t:"gh"})}
            else if(!grid[i][j].box && grid[i][j].glueP){powerups.push({x:i, y:j, t:"gl"})}
            else if(!grid[i][j].box && grid[i][j].mineP){powerups.push({x:i, y:j, t:"m"})}

        }
    }
    return { b: boxes,f:fire, g:glue, m:mines, p: minPlayers,bo:bombs, po:powerups, t: time, bu:bushes, e:minEnemies};

}

function addBomb(grid, timer){
    var prob = Math.random();
    if(prob > Math.log(timer) ) { return;}
    var x = Math.floor(Math.random()*grid.length);
    var y = Math.floor(Math.random()* grid[0].length);
    if(grid[x][y].bomb || grid[x][y].wall || grid[x][y].box || grid[x][y].boots ||  grid[x][y].bombP){
        addBomb(grid);
    }
    else{
        grid[x][y].bomb = {player: undefined, timer: 1, active: true, strength:2}
    }
}

function addItem(grid){
  
    var x = Math.floor(Math.random()*grid.length);
    var y = Math.floor(Math.random()* grid[0].length);
    
    var r = Math.random();
    if(r < 0.99){return;}
   
    if(grid[x][y].bomb || grid[x][y].wall || grid[x][y].box || grid[x][y].boots ||  grid[x][y].bombP){
       
    }
    else{
    	var powerup = boardModule.randomPowerup();
        grid[x][y][powerup] = true;
    }
    
}

