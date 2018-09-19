const express = require('express');
const app = express();
var mongoose = require("mongoose")
var Schema = mongoose.Schema;
var bodyParser = require("body-parser")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public', express.static(__dirname + '/public'));

// Banco de dados
//var conString = "mongodb://hudson:adm9210@ds259912.mlab.com:59912/chatapp"
var conString = "mongodb://localhost/chatapp"
app.use(express.static(__dirname))

var Chats = new Schema({
    message: String,
    username: { type: String, required: true, unique: true },
});
var User = mongoose.model('User', Chats);

mongoose.connect(conString,{ useNewUrlParser: true}, (err) => {
    console.log("Database connection", conString)
});
mongoose.Promise = Promise

// template engine
app.set('view engine', 'ejs');

//middleware
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
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
        io.sockets.emit("new_message", { message: data.message, username: socket.username });
    });
});

// Salvando
//data.save(function(err) {
  //  if (err) throw err;
  
    //console.log('User created!');
  //});