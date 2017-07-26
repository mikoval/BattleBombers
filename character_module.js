module.exports = {
    CharacterList:["fox", "bun", "jones", "spear"],
    CharacterStats:{
        fox:{speed: 0.08, bombMax :1, bombStrength: 1 },
        bun:{speed: 0.05, bombMax :2, bombStrength: 2 },
        jones:{speed: 0.06, bombMax :1, bombStrength: 3 },
        spear:{speed: 0.04, bombMax :2, bombStrength: 4 },
    },
    getValidCharacter : function(players){
        for(var i = 0; i < this.CharacterList.length; i++){
            for(var j = 0; j < players.length; j++){
                if(players[j].character == this.CharacterList[i]){
                    continue;
                }
                return this.CharacterList[i];
            }
        }
    },
    getCharacterStats: function(str){
        return this.CharacterStats[str];
    }

};
