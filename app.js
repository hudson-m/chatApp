const express = require('express');
const app = express();
var bodyParser = require("body-parser")
var mongoose = require('mongoose');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use('/public', express.static(__dirname + '/public'));

// Banco de dados
var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  passwordConf: {
    type: String,
    required: true,
  }
});

//Tranforma senha em hash para quando for para o database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.password, 10, function (err, hash){
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    })
  });

var User = mongoose.model('User', UserSchema);
module.exports = User;

// Não salva as informações da sessão, mas sim o ID
// Tudo é salvo dentro do cookie do navegador
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
  }));

// template engine
app.set('view engine', 'ejs');

//middleware
app.use(express.static('public'));

//routes
app.get('/chat', (req, res) => {
    res.render('index');
});

app.post('/', (req, res) =>{
    if (req.body.email &&
        req.body.username &&
        req.body.password &&
        req.body.passwordConf) {
        var userData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        passwordConf: req.body.passwordConf,
        }
        //use schema.create to insert data into the db
        User.create(userData, function (err, user) {
        if (err) {
            return next(err)
        } else {
            return res.redirect('/profile');
        }
        });
    }
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