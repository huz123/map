//main
/* Author: Haibo Zhang huz123@psu.edu
 */

//var app  = require('express')();

var fs   = require('fs');
var pkey = fs.readFileSync('prik2.pem');
var pcert = fs.readFileSync('cart2.pem');
var pca = fs.readFileSync('ca2.pem');

var options = {
    key: pkey,
    cert: pcert,
    ca: pca
};

var express    = require('express');
var app = express();
var https = require('https').createServer(options, app);
var io   = require('socket.io')(https);

app.get('/', function(req, res){
	res.sendFile('/home/ubuntu/latest/chatroom/index.html');
});



var onlineUsers = {}; 

var onlineCount =  0;

io.on('connection', function(socket){
	console.log('User Connected at :' + Date());

	socket.on('login', function(obj){
		socket.name = obj.userid;
		
		if (!onlineUsers.hasOwnProperty(obj.userid)){
			onlineUsers[obj.userid] = obj.username;

			onlineCount++;
		}

		io.emit('login', {onlineUser:onlineUsers, onlineCount:onlineCount, user:obj});
		console.log(obj.username + ' join marauderMap.');	
	});

	socket.on('disconnect', function() {
		if(onlineUsers.hasOwnProperty(socket.name)) {
			//退出用户的信息
			var obj = {userid:socket.name, username:onlineUsers[socket.name]};
			
			//删除
			delete onlineUsers[socket.name];
			//在线人数-1
			onlineCount--;
			
			//向所有客户端广播用户退出
			io.emit('logout', {onlineUsers:onlineUsers, onlineCount:onlineCount, user:obj});
			console.log(obj.username+' exit marauderMap.');
		}
		
	});

	socket.on('message', function(obj){
		var msg = obj.content;
		if (msg.indexOf("GPS") !== -1) {
			var res = msg.split(" ");
			console.log("GET GPS: " + obj.username +  " lat " + res[2] +" lon " + res[3]);
		}
		else { 
			console.log("NORMAL MSG!");
		}
		io.emit('message', obj);
		
	});


});
	

https.listen(8124, function(){
	console.log('listening on *:8124');
});

