
function createGrid(width, height){
    var arr = []
    for(var i = 0; i < width; i++)
    {   
        arr.push([])
        for(var j = 0; j < height; j++){
            arr[i].push({});
        }
    }
    return arr;
}

function createRoom(number){
    socket.emit('create-game', {name: name, size:number});

}
function joinRoom(id){
    socket.emit('join-game', {name: name, room: id})
}
function invalidRoom(data){
    console.log('invalid room');
}
function waitingRoom(data){
    removeElements(); 
    var players = data.players;
    var size = data.size;
    var code = data.id;
    var WaitingDiv = createElement("div");
    WaitingDiv.class("waiting-div");

    var prompt = createElement("h2", 'Waiting for more players to join');
    prompt.class("title")
    prompt.parent(WaitingDiv)

    var PlayersDiv = createElement("div");
    PlayersDiv.class("text-wrapper")
    for (var i = 0; i < players.length; i++){
        var player = createElement("p", players[i].name);
        player.parent(PlayersDiv);
    }
    var remaining = createElement("p", "Need " + (size - players.length) + " player(s) to start");
    remaining.parent(PlayersDiv);

    PlayersDiv.parent(WaitingDiv);

    var imageWrapper = createElement("div");
    imageWrapper.class("center-div");
    var image = createImg('http://i.imgur.com/tOXXtXu.gif');
    image.parent(imageWrapper);
    imageWrapper.parent(WaitingDiv);

    var inviteDiv = createElement("div");
    inviteDiv.class("text-wrapper")
    var inviteMsg = createElement("p", "Invite others by using the code: " + code);
    inviteMsg.parent(inviteDiv);
    inviteDiv.parent(WaitingDiv);
    WaitingDiv.center();
}
function startGame(data){
    console.log(data);
    removeElements();
    background(51);
    state = "Current Game";
    grid = data.game.grid;
    squareSize = height/grid.length;
    players = data.players;

    directionLoop = setInterval(updatePosition, 30);
}
function updateGame(data){
    players = data.players;
    grid = data.game.grid;
}
function updatePosition(){
    socket.emit('update-input', direction);
}