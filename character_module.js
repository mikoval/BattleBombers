module.exports = {
    CharacterList:["fox", "bun", "jones", "spear"],
    CharacterStats:{
        fox:{speed: 0.08, bombMax :1, bombStrength: 1 },
        bun:{speed: 0.05, bombMax :2, bombStrength: 1 },
        jones:{speed: 0.06, bombMax :1, bombStrength: 3 },
        spear:{speed: 0.04, bombMax :2, bombStrength: 4 },
    },
    getValidCharacter : function(players){
        for(var i = 0; i < this.CharacterList.length; i++){
            var match = false;
            for(var j = 0; j < players.length; j++){
                if(players[j].sprite == this.CharacterList[i]){
                    match = true                }
                
            }
            if(!match)
                return this.CharacterList[i];
        }
    },
    getCharacterStats: function(str){
        return this.CharacterStats[str];
    },
    loadCharacter: function(type, x, y){
        var stats = this.getCharacterStats(type);
        var player = new character(stats, x, y);
        return player;
    }

};
function character(stats, x, y){
    this.position = {x: x, y:y};

    this.lives = 3;
    this.invulnerable = -1;
    this.dir = "front";
    this.moving = false;
    this.ghost = -1.0;
    this.glue = 0;
    this.bombStrength = stats.bombStrength;
    this.bombMax = stats.bombMax;
    this.bombCount = 0;
    this.speed = stats.speed;
    this.mines = 0;
}