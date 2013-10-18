// server.js
var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var io      = require('socket.io').listen(server);

var redis = require('redis');
var url = require('url');
var redisURL = url.parse('redis://rediscloud:KWSKkL8OrXsgvizE@pub-redis-13710.us-east-1-4.1.ec2.garantiadata.com:13710');
var client = redis.createClient(redisURL.port, redisURL.hostname, {no_ready_check: true});
client.auth(redisURL.auth.split(":")[1]);

var Room = io
.of('/ui_centers')
.on('connection', function(socket) {
  var routes = null;
  socket.on('centers', function(data) {
	console.log('0000000000000/' + data + '/');
    socket.join(data);
    routes = data;
    
//    socket.emit('centers', "you've joined " + data);
    socket.broadcast.emit('centers', 'someone joined room');
  }); 
  socket.on('insert', function(data) {
    if (routes) {
    	console.log('0000000000001');
    	// 그냥 socket.io 만 쓸 때
    	socket.broadcast.emit('inserted', data);
    } else {
    	console.log('0000000000002' + data);
    	socket.send('login first');
    }
  });
  socket.on('update', function(data) {
	console.log('0000000000003');
	// 그냥 socket.io 만 쓸 때
	socket.broadcast.emit('updated', data);
  });
  socket.on('delete', function(data) {
	console.log('0000000000005');
	socket.emit('deleted', data);
	socket.broadcast.emit('deleted', data);
  });
});

console.log('__dirname:' + __dirname);
app.use(express.static(__dirname + ''));

server.listen(8080);


// redis를 쓸 
//client.set("some key", "some val");
//client.get("some key", function(err, reply) {
//    console.log(reply);
//    data += reply;
//      socket.broadcast.to(routes).send(data);
//});
//client.quit();
