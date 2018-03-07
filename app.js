let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/webhook', function(req, res) {
    let users = req.body.users;
    console.log(users);
    users = JSON.parse(users);
    users.forEach(user => {
        io.sockets.in(user).emit('message', 'A message to ' + user);
    })
    console.log('webhook!');
});

io.on('connection', function(socket) {
    socket.on('room', function(room) {
        socket.join(room);
        console.log('joined room: ' + room);
    })
    console.log('a user connected');
    // io.emit('hej', 'hallå!');
});

http.listen(3001, function() {
    console.log('Socket server listening on *:3001');
});