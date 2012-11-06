
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , redis = require('redis')
  , client = redis.createClient();

var app = express();

client.on("error", function(err) {
  console.log("REDIS ERR: " + err);
});

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'hjs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {
  console.log(socket.id + ' connected');

  var game = require('cities-game');

  socket.on('new game', function(id) {
    console.log("creating game on socket " + socket);
    socket.room = id;
    socket.join(id);
    game.buildDeck();
    console.log("deck built: " + JSON.stringify(game.getDeck()));
    client.set(socket + ":deck", JSON.stringify(game.getDeck()), redis.print);
    console.log("broadcasting");
    socket.broadcast.in(id).emit('game created', {
      id: id
    });
  })

  /* io.sockets.emit('this', { will: 'be received by everyone'});

  socket.on('private message', function (from, msg) {
    console.log('I received a private message by ', from, ' saying ', msg);
  });

  socket.on('disconnect', function () {
    io.sockets.emit('user disconnected');
  }); */
});