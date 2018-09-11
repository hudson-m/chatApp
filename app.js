const express = require('express');
const app = express();
app.use('/public',express.static(__dirname + '/public'));

// template engine
app.set('view engine','ejs');

//middleware
app.use(express.static('public'));

//routes
app.get('/', (req,res) => {
    res.render('index');
});

//Listen on port 4200
server = app.listen(4200);

//socket.io instantation
const io = require("socket.io")(server);

io.on('connection', (socket) => {
    console.log('Novo usuário conectado!');

    //default username
    socket.username = "Anônimo";

    //listen no "Trocar apelido"
    socket.on('change_username', (data) => {
        socket.username = data.username;
    });

    //listen on new_message
    socket.on('new_message', (data) => {
        //broadcast the new message
        io.sockets.emit("new_message", {message : data.message, username : socket.username});
    });
});

