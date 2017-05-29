var express = require('express');
var app = express();
var port = process.env.PORT || 8080;


var server = app.listen(port, function() {
    console.log('Our app is running on http://localhost:' + port);
});

app.use(express.static(__dirname + '/public'));


app.get('/', function (req, res) {
  res.render('index.ejs', { title: 'Hey', message: 'Hello there!' })
})


var socket = require('socket.io');

var io = socket(server);

io.sockets.on('connection', newConnection);

function newConnection(socket){
    

    
 
}

