
var dist = {};
(function () {                                                     
	var d = document,
	w = window;
		w.CHAT = {
		username:null,
		userid:null,
		socket:null,
		lat:null,
		lot:null,
		map:null,
		//提交聊天消息内容
		submit:function(){
			var content = "2"; //d.getElementById("content").value;
			if(content != ''){
				var obj = {
					userid: this.userid,
					username: this.username,
					content: content
				};
				this.socket.emit('message', obj);
			}
			return false;
		},
		genUid:function(){
			return new Date().getTime()+""+Math.floor(Math.random()*899+100);
		},
		//更新系统消息，本例中在用户加入、退出的时候调用
		updateSysMsg:function(o, action){
			//当前在线用户列表
			var onlineUsers = o.onlineUsers;
			//当前在线人数
			var onlineCount = o.onlineCount;
			//新加入用户的信息
			var user = o.user;
				
			//更新在线人数
			var userhtml = '';
			var separator = '';
			for(key in onlineUsers) {
		        if(onlineUsers.hasOwnProperty(key)){
					userhtml += separator+onlineUsers[key];
					separator = '、';
				}
		    }
		},
		getLoc:function(callback) {
		  navigator.geolocation.getCurrentPosition (function (position){
			lat = position.coords.latitude;
			lot = position.coords.longitude;
		  	var coords = position.coords.latitude + " " + position.coords.longitude;
			  callback(coords);         
		  })
		},
		sendUserPos:function(){
			this.getLoc(function(){});
			var p = "GPS " + this.username + " " + lat + " " +lot;
			var o = {
				userid: this.userid,
				username: this.username,
				content: p
			};
			this.socket.emit('message', o);
		},
		usernameSubmit:function(){
			var username = d.getElementById("username").value;
			if(username != ""){
				d.getElementById("username").value = '';
				d.getElementById("loginbox").style.display = 'none';
				d.getElementById("map").style.display = 'block';
				this.init(username);
			}
			return false;
		},
		//第一个界面用户提交用户名
		init:function(username){
			//map = m;
			/*
			客户端根据时间和随机数生成uid,这样使得聊天室用户名称可以重复。
			实际项目中，如果是需要用户登录，那么直接采用用户的uid来做标识就可以
			*/
			this.userid = this.genUid();
			this.username = username;
			
			//连接websocket后端服务器
			this.socket = io.connect('https://maraudermap.info:8124', {secure: true});
			
			//告诉服务器端有用户登录
			this.socket.emit('login', {userid:this.userid, username:this.username});
			
			//监听新用户登录
			this.socket.on('login', function(o){
				CHAT.updateSysMsg(o, 'login');	
			});
			
			//监听用户退出
			this.socket.on('logout', function(o){
				CHAT.updateSysMsg(o, 'logout');
				var uname = o.user.username;
				delete dist[uname];
			});
			
			//监听消息发送
			this.socket.on('message', function(obj){
				var msg = obj.content;
				if (msg.indexOf("GPS") !== -1) {
					var res = msg.split(" ");
					var uname = res[1];
					var lat   = res[2];
					var lot   = res[3];
					var m = map;
      					var iconBase = 'https://maps.google.com/mapfiles/kml/pal5/';
					
					console.log("GPS " + uname + " " + lat + " " + lot);
					
					console.log("icon: " + uname.charCodeAt(0));
					var idicon = uname.charCodeAt(0)%26 + 26;
					var markerProp = new google.maps.Marker({
						position: {lat: Number(lat), lng: Number(lot)},
						map: m,
						icon: iconBase + 'icon'+idicon+'l.png',
					});
						
					dist[uname] = markerProp;
			                for (var k in dist) {
			          		dist[k].setMap(null);
        				}	
					for (var k in dist) {
						dist[k].setMap(m);
					}	
									

				} else { 
					console.log("NORMAL MSG!");
				}
					var isme = (obj.userid == CHAT.userid) ? true : false;
				
			});

		},
         	
		/*markers:[],
		
		drop:function(neigh) {
       			clearMarkers();
        		for (var i = 0; i < neigh.length; i++) {
          			addMarkerWithTimeout(neigh[i], i * 200);
        		}
      		},

	      	addMarkerWithTimeout:function (position, timeout) {
        		markers.push(new google.maps.Marker({
	                	position: position,
             			map: map,
		       		animation: google.maps.Animation.DROP
              			}));
              		});
      	        },

		clearMarkers:function() {
        		for (var i = 0; i < markers.length; i++) {
          			markers[i].setMap(null);
        		}
        		markers = [];
      		}*/

	};


//asdsadfsafd
	d.getElementById("username").onkeydown = function(e) {
		e = e || event;
		if (e.keyCode === 13) {
			CHAT.usernameSubmit();
		}
	};
})();
