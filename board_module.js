module.exports = {
    createGrid : function(width, height){

        var arr = []

        for(var i = 0; i < width; i++)
        {   
            arr.push([])
            for(var j = 0; j < height; j++){
               
                arr[i].push({})
                
               

                
            }
        }
        return arr;
    },
    validate: function(g){

        var count = 0;
        var arr = [{x:1, y:1}];
        var width = g.length;
        var height = g[0].length;
        while(arr.length > 0){
            var pos = arr.pop();
            if(g[pos.x][pos.y].visited != undefined){continue;}
            g[pos.x][pos.y].visited = true;
            if(pos.x == width - 2 && pos.y == height-2){count++;}
            if(pos.x == width - 2 && pos.y == 1){count++;}
            if(pos.x == 1 && pos.y == height-2){count++;}

            if(!g[pos.x + 1][pos.y].wall && !g[pos.x + 1][pos.y].visited){arr.push({x:pos.x+1, y:pos.y})}
            if(!g[pos.x - 1][pos.y].wall && !g[pos.x - 1][pos.y].visited){arr.push({x:pos.x-1, y:pos.y})}
            if(!g[pos.x][pos.y+1].wall && !g[pos.x][pos.y+1].visited){arr.push({x:pos.x, y:pos.y+1})}
            if(!g[pos.x][pos.y-1].wall && !g[pos.x][pos.y-1].visited){arr.push({x:pos.x, y:pos.y-1})}
        }
        if(count == 3){
            return true;
        }
        else{
            return false;
        }

    },
    createBox: function(width, height){
        var arr = this.createGrid(width, height);
        for(var i = 0; i < width; i++)
        {   
            for(var j = 0; j < height; j++){
                if(i == 0 || i == width-1 || j == 0 || j == height-1 ) {
                    arr[i][j] = {wall : true, fireTimer: -1, box: false,};
                }
                else{
                    arr[i][j] = {fireTimer: -1, box:false, };
                }

                
            }
        }
        return arr;
    },
    randomStandardMap: function(width, height){
        var i = Math.floor(Math.random()*3);
        if(i == 0){
            return this.standardSimple(width, height);
        }
        if(i == 1){
            return this.standardEmpty(width, height);
        }
        if(i == 2){
            return this.standardRandom(width, height);
        }
    },
    standardSimple: function(width, height){
        var arr = this.createBox(width, height);
        for(var i = 1; i < width-1; i++)
        {   
            for(var j = 1; j < height -1; j++){
                if( i %2 ==  0 && j %2 == 0 ){
                    arr[i][j].wall = true;
                }
                //bottom right
                if((i == width-2 && j == height-2) || (i == width-2 && j == height-3) || (i == width-3 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top left
                if((i == 1 && j == 1) || (i ==1 && j ==2) || (i == 2 && j == 1)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top right
                if((i == 1 && j == height-2) || (i ==1 && j == height-3) || (i == 2 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //bottom left
                if((i ==  width-2 && j ==1) || (i ==width-3 && j ==  1) || (i == width-2 && j == 2)) {
                    arr[i][j].wall = false;
                    continue;
                }
                
                if(Math.random() < .8 && !arr[i][j].wall){
                    var rand = Math.random();
                    arr[i][j].box = true;
                    if(rand < 0.05)
                        arr[i][j].lifeP = true;
                    else if(rand < 0.20)
                        arr[i][j].boots = true;
                    else if (rand < 0.35)
                        arr[i][j].bombP = true;
                    else if (rand < 0.50)
                        arr[i][j].bombS = true;
                    else if(rand < 0.55)
                        arr[i][j].ghost = true;
                    else if(rand < 0.60)
                        arr[i][j].glueP = true;
                    else if(rand < 0.65)
                        arr[i][j].mineP = true;
                }
            }
        }

        return arr;

    
    },
    standardRandom: function(width, height){
        var arr = this.createBox(width, height);
        for(var i = 1; i < width-1; i++)
        {   
            for(var j = 1; j < height -1; j++){
                if(Math.round(Math.random()*10)%4 == 0){
                    arr[i][j] = {wall : true, fireTimer: -1, box: false,  center : {x: i + 0.5, y: j+0.5}, innerRadius: 1, outerRadius:  1.4142}
                }

               //bottom right
                if((i == width-2 && j == height-2) || (i == width-2 && j == height-3) || (i == width-3 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top left
                if((i == 1 && j == 1) || (i ==1 && j ==2) || (i == 2 && j == 1)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top right
                if((i == 1 && j == height-2) || (i ==1 && j == height-3) || (i == 2 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //bottom left
                if((i ==  width-2 && j ==1) || (i ==width-3 && j ==  1) || (i == width-2 && j == 2)) {
                    arr[i][j].wall = false;
                    continue;
                }


                if(Math.random() < .8 && !arr[i][j].wall){
                    var rand = Math.random();
                    arr[i][j].box = true;
                    if(rand < 0.05)
                        arr[i][j].lifeP = true;
                    else if(rand < 0.20)
                        arr[i][j].boots = true;
                    else if (rand < 0.35)
                        arr[i][j].bombP = true;
                    else if (rand < 0.50)
                        arr[i][j].bombS = true;
                    else if(rand < 0.55)
                        arr[i][j].ghost = true;
                    else if(rand < 0.60)
                        arr[i][j].glueP = true;
                    else if(rand < 0.65)
                        arr[i][j].mineP = true;
                }
                
            }
        }
        if(!this.validate(arr)){
            arr = this.standardRandom(width,height);
        }
        return arr;
    },
    standardEmpty: function(width, height){
        var arr = this.createBox(width, height);
        for(var i = 1; i < width-1; i++)
        {   
            for(var j = 1; j < height -1; j++){
                //bottom right
                if((i == width-2 && j == height-2) || (i == width-2 && j == height-3) || (i == width-3 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top left
                if((i == 1 && j == 1) || (i ==1 && j ==2) || (i == 2 && j == 1)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top right
                if((i == 1 && j == height-2) || (i ==1 && j == height-3) || (i == 2 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //bottom left
                if((i ==  width-2 && j ==1) || (i ==width-3 && j ==  1) || (i == width-2 && j == 2)) {
                    arr[i][j].wall = false;
                    continue;
                }


                if(Math.random() < .8 && !arr[i][j].wall){
                    var rand = Math.random();
                    arr[i][j].box = true;
                    if(rand < 0.05)
                        arr[i][j].lifeP = true;
                    else if(rand < 0.20)
                        arr[i][j].boots = true;
                    else if (rand < 0.35)
                        arr[i][j].bombP = true;
                    else if (rand < 0.50)
                        arr[i][j].bombS = true;
                    else if(rand < 0.55)
                        arr[i][j].ghost = true;
                    else if(rand < 0.60)
                        arr[i][j].glueP = true;
                    else if(rand < 0.65)
                        arr[i][j].mineP = true;
                }
                
            }
        }
    
        return arr;
    },
    forestRandom:function(width, height){
        console.log("forest random");
        var arr = this.createBox(width, height);
        for(var i = 1; i < width-1; i++)
        {   
            for(var j = 1; j < height -1; j++){
                if(Math.round(Math.random()*10)%4 == 0){
                    arr[i][j] = {wall : true, fireTimer: -1, box: false,  center : {x: i + 0.5, y: j+0.5}, innerRadius: 1, outerRadius:  1.4142}
                }

               //bottom right
                if((i == width-2 && j == height-2) || (i == width-2 && j == height-3) || (i == width-3 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top left
                if((i == 1 && j == 1) || (i ==1 && j ==2) || (i == 2 && j == 1)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top right
                if((i == 1 && j == height-2) || (i ==1 && j == height-3) || (i == 2 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //bottom left
                if((i ==  width-2 && j ==1) || (i ==width-3 && j ==  1) || (i == width-2 && j == 2)) {
                    arr[i][j].wall = false;
                    continue;
                }


                if(Math.random() < .7 && !arr[i][j].wall){
                    var rand = Math.random();
                    arr[i][j].box = true;
                    if(rand < 0.05)
                        arr[i][j].lifeP = true;
                    else if(rand < 0.20)
                        arr[i][j].boots = true;
                    else if (rand < 0.35)
                        arr[i][j].bombP = true;
                    else if (rand < 0.50)
                        arr[i][j].bombS = true;
                    else if(rand < 0.55)
                        arr[i][j].ghost = true;
                    else if(rand < 0.60)
                        arr[i][j].glueP = true;
                    else if(rand < 0.65)
                        arr[i][j].mineP = true;
                }
                else if (!arr[i][j].wall){
                    arr[i][j].bush = {timer:0.0};
                }
                
            }
        }
        if(!this.validate(arr)){
            arr = this.standardRandom(width,height);
        }
        return arr;
    },
    forestFull: function(width, height){
        var arr = this.createBox(width, height);
        for(var i = 1; i < width-1; i++)
        {   
            for(var j = 1; j < height -1; j++){
                //bottom right
                if((i == width-2 && j == height-2) || (i == width-2 && j == height-3) || (i == width-3 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top left
                if((i == 1 && j == 1) || (i ==1 && j ==2) || (i == 2 && j == 1)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //top right
                if((i == 1 && j == height-2) || (i ==1 && j == height-3) || (i == 2 && j == height-2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                //bottom left
                if((i ==  width-2 && j ==1) || (i ==width-3 && j ==  1) || (i == width-2 && j == 2)) {
                    arr[i][j].wall = false;
                    continue;
                }

                if(!arr[i][j].wall)
                    arr[i][j].bush = {timer:0.0};
                

                if(Math.random() < .8 && !arr[i][j].wall){
                    var rand = Math.random();
                    
                    if(rand < 0.05)
                        arr[i][j].lifeP = true;
                    else if(rand < 0.20)
                        arr[i][j].boots = true;
                    else if (rand < 0.35)
                        arr[i][j].bombP = true;
                    else if (rand < 0.50)
                        arr[i][j].bombS = true;
                    else if(rand < 0.55)
                        arr[i][j].ghost = true;
                    else if(rand < 0.60)
                        arr[i][j].glueP = true;
                    else if(rand < 0.65)
                        arr[i][j].mineP = true;
                }
                
            }
        }
    
        return arr;
    }
    
}
