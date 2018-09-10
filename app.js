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

//Listen on port 3000
server = app.listen(3000);

//socket.io instantation
const io = require("socket.io")(server);

io.on('connection', (socket) => {
    console.log('Novo usuário conectado!');
});

