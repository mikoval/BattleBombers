module.exports = {
    squirrel: function(x, y){
        console.log("created")
        this.position = {x:x + 0.5, y:y + 0.5};
        this.target = undefined;
        this.speed = 0.05;
        this.path = [];
        this.type= "squirrel";
        this.dir = "front";
        this.moving = false;
        this.count = 0;
        this.powerups = [];
        this.invince = -1;
        this.update = function(grid){
            var x = Math.floor(this.position.x);
            var y = Math.floor(this.position.y);
            if(grid[x][y].fireTimer > 0 && this.invince < 0){
                this.invince = 1.0;
                this.dropPowerup(grid);
                this.path = this.findPathToBush(grid);
                console.log("going to bush")       }
            if(this.invince > 0.0){
                this.invince -= 0.03;
            }
            else{
                if(hasPowerups(grid, {x:x, y:y})){
                    this.collectPowerups(grid);
                    this.findPathToBush(grid);
                }
                
                
            }

            if(this.path.length == 0){
            	
            	

            	this.path = this.findPathToItem(grid);
        
          

                if(this.path.length == 0 && (!grid[x][y].bush || grid[x][y].bush.timer > 0 )){
                    this.path = this.findPathToBush(grid);
                }
            	

            }
            if(this.path.length > 0){
                if(this.path.length > 1){
                    if(grid[this.path[1].x][ this.path[1].y].bomb){
                        //this.path = [];
                        this.path = this.findPathToItem(grid);
                        return;
                    }
                }
                
                var target = this.path[this.path.length -1];

                



                this.moving = true;
                this.moveTo(this.path[0].x, this.path[0].y);
                if(this.position.x == this.path[0].x + 0.5 && this.position.y == this.path[0].y + 0.5){
                    this.path.splice(0, 1);
                }
                if(this.path.length > 0){
                    if(!hasPowerups(grid,target) && (!grid[target.x][target.y].bush || grid[target.x][target.y].bush.timer > 0 ) ){
                        this.path = [];
                    }
                }

                

               
            }
            else{
                this.moving = false;
            }
            
        } 
        this.findPathToItem = function(g){
            var arr = [{x:Math.floor(this.position.x), y:Math.floor(this.position.y), path: []}];
            var width = g.length;
            var height = g[0].length;
            while(arr.length > 0){
                var pos = arr.shift();
                
                var path = pos.path.slice();

                path.push({x:pos.x,y:pos.y});
                if(g[pos.x][pos.y].visited != undefined){continue;}
                g[pos.x][pos.y].visited = true;

                if(hasPowerups(g, pos) )
                    return path;
                

                if( !g[pos.x + 1][pos.y].wall&&!g[pos.x + 1][pos.y].box&&!g[pos.x + 1][pos.y].bomb && !g[pos.x + 1][pos.y].visited){arr.push({x:pos.x+1, y:pos.y, path:path})}
                if(!g[pos.x - 1][pos.y].wall &&!g[pos.x - 1][pos.y].box && !g[pos.x - 1][pos.y].bomb && !g[pos.x - 1][pos.y].visited){arr.push({x:pos.x-1, y:pos.y,path:path})}
                if(!g[pos.x][pos.y+1].wall && !g[pos.x][pos.y+1].box && !g[pos.x][pos.y+1].bomb && !g[pos.x][pos.y+1].visited){arr.push({x:pos.x, y:pos.y+1, path:path})}
                if(!g[pos.x][pos.y-1].wall && !g[pos.x][pos.y-1].box && !g[pos.x][pos.y-1].bomb&&!g[pos.x][pos.y-1].visited){arr.push({x:pos.x, y:pos.y-1, path:path})}
            }
            for(var i = 0; i < width; i++){   
                for(var j = 0; j < height; j++){
                    g[i][j].visited = undefined;
                }
            }
            return [];
            
        }
        this.findPathToBush = function(g){
            var arr = [{x:Math.floor(this.position.x), y:Math.floor(this.position.y), path: []}];
            var width = g.length;
            var height = g[0].length;
            while(arr.length > 0){
                var pos = arr.shift();
                
                var path = pos.path.slice();

                path.push({x:pos.x,y:pos.y});
                if(g[pos.x][pos.y].visited != undefined){continue;}
                g[pos.x][pos.y].visited = true;

                if(g[pos.x][pos.y].bush &&  g[pos.x][pos.y].bush.timer <= 0 )
                    return path;
                

                if(!g[pos.x + 1][pos.y].wall&&!g[pos.x + 1][pos.y].box&&!g[pos.x + 1][pos.y].bomb && !g[pos.x + 1][pos.y].visited){arr.push({x:pos.x+1, y:pos.y, path:path})}
                if(!g[pos.x - 1][pos.y].wall &&!g[pos.x - 1][pos.y].box&&!g[pos.x - 1][pos.y].bomb && !g[pos.x - 1][pos.y].visited){arr.push({x:pos.x-1, y:pos.y,path:path})}
                if(!g[pos.x][pos.y+1].wall && !g[pos.x][pos.y+1].box&&!g[pos.x][pos.y+1].bomb && !g[pos.x][pos.y+1].visited){arr.push({x:pos.x, y:pos.y+1, path:path})}
                if(!g[pos.x][pos.y-1].wall && !g[pos.x][pos.y-1].box && !g[pos.x][pos.y-1].bomb&&!g[pos.x][pos.y-1].visited){arr.push({x:pos.x, y:pos.y-1, path:path})}
            }
            for(var i = 0; i < width; i++){   
                for(var j = 0; j < height; j++){
                    g[i][j].visited = undefined;
                }
            }
            return [];
            
        }
        this.moveTo = function(x, y){

            x = x + 0.5;
            y = y + 0.5;
           
            var speed = this.speed;
            var position = this.position;
            if(x != position.x){
                var dir = x - position.x;

                dir = dir / Math.abs(dir);
                if(dir < 0){
                    this.dir = "left";
                }
                else{
                    this.dir = "right";
                }

                position.x += dir * speed;
                var dir2 =  x - position.x;
                if(dir2 != 0)
                    dir2 = dir2 / Math.abs(dir2);
                if(dir2 != dir){
                    position.x = x;
                }
            }
            else if(y != position.y){
                var dir = y - position.y;

                dir = dir / Math.abs(dir);
                if(dir < 0){
                    this.dir = "back";
                }
                else{
                    this.dir = "front";
                }

                position.y += dir * speed;
                var dir2 =  y - position.y;
                if(dir2 != 0)
                    dir2 = dir2 / Math.abs(dir2);
                if(dir2 != dir){
                    position.y = y;
                }
            }

        }
        this.collectPowerups = function(g){
            var pos  = {x: Math.floor(this.position.x), y: Math.floor(this.position.y)};
            if( g[pos.x][pos.y].boots){
                g[pos.x][pos.y].boots = undefined;
                this.powerups.push("boots");
            }
            if( g[pos.x][pos.y].bombP){
                g[pos.x][pos.y].bombP = undefined;
                this.powerups.push("bombP");
            }
            if( g[pos.x][pos.y].bombS){
                g[pos.x][pos.y].bombS = undefined;
                this.powerups.push("bombS");
            }
            if( g[pos.x][pos.y].ghost){
                g[pos.x][pos.y].ghost = undefined;
                this.powerups.push("ghost");
            }
            if( g[pos.x][pos.y].glueP){
                g[pos.x][pos.y].glueP = undefined;
                this.powerups.push("glueP");
            }
            if( g[pos.x][pos.y].mineP){
                g[pos.x][pos.y].mineP = undefined;
                this.powerups.push("mineP");
            }
            if( g[pos.x][pos.y].lifeP){
                g[pos.x][pos.y].lifeP = undefined;
                this.powerups.push("lifeP");
            }
        }
        this.dropPowerup = function(g){
            var pos  = {x: Math.floor(this.position.x), y: Math.floor(this.position.y)};
            g[pos.x][pos.y][this.powerups.shift()] = true;
           
        }
    }
    
}
function hasPowerups(g, pos){
    if(g[pos.x][pos.y].boots || g[pos.x][pos.y].bombP || g[pos.x][pos.y].bombS || 
        g[pos.x][pos.y].mineP || g[pos.x][pos.y].glueP || g[pos.x][pos.y].ghost||g[pos.x][pos.y].lifeP  )
        return true;
    return false;

}
