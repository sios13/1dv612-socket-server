let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
    res.send('test :)')
})

app.post('/webhook', function(req, res) {
    let users = req.body.users;
    console.log(req.body);
    users = JSON.parse(users);
    users.forEach(user => {
        io.sockets.in(user).emit('webhook', 'A message to ' + user);
    })
    console.log('webhook!');
});

io.on('connection', function(socket) {
    socket.on('room', function(room) {
        socket.join(room);
        console.log('joined room: ' + room);
    })
    console.log('a user connected');
});

http.listen(3001, function() {
    console.log('Socket server listening on *:3001');
});
