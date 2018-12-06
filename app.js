var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var socket_io    = require( "socket.io" );

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var io = socket_io();
app.io = io;

let players = []




io.on('connection', function(socket){
  console.log('a user connected', socket.id);

  let player = {
    name:'test',
    id:socket.id,
    x:0,
    y:0,
    z:0
  }
  players.push(player)


  console.log('emmiting players')
  io.sockets.emit('players', players);

  socket.on('disconnect', function(){
    console.log('user disconnected');
  });


  socket.on('movement', (data) => {
    players.map((player) => {
      if (player.id == data.id) {
        player.x = data.position.x
        player.y = data.position.y
        player.z = data.position.z
      }
    })
  })

  //send players back later

});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/scripts', express.static(path.join(__dirname, 'node_modules/three/build')));
// app.use('/scripts', express.static(path.join(__dirname, 'node_modules/three-orbit-controls')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;
