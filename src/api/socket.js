// import store from '../store'
// import router from '../router'
// import {Message} from "element-ui";
// var websock = null
// var globalCallback = null;
// var interval = null; //定时器
// var isOver80 = false; //硬盘使用率是否超过80%%
// var isOver = false; //用户启动检测,如果硬盘使用率超过80%自动停止,并弹窗提示用户为何停止
//
// //初始化websocket
// function initWebSocket() {
// 	const userId = sessionStorage.getItem('userId')
// 	console.log("%%%%%%%%%%%%%################^^^^^^^^^^^^^")
// 	console.log(userId)
// 	console.log("%%%%%%%%%%%%%################^^^^^^^^^^^^^")
//
// 	var ws = 'ws://' + window.g.baseURL + '/websocket/' + 'admin';
//
// 	websock = new WebSocket(ws)
// 	websock.onmessage = function(e) {
// 		websocketonmessage(e)
// 	}
// 	websock.onclose = function(e) {
// 		websocketclose(e);
// 	}
// 	websock.onopen = function() {
// 		websocketOpen()
// 	}
// 	// 连接发生错误的回调方法
// 	websock.onerror = function() {
// 		console.log('链接失败--重新链接');
// 		initWebSocket()
// 	}
// 	//发送心跳包
// 	interval = window.setInterval(function() {
// 		if (websock != null) {
// 			let heart = {
// 				"heart": "HeartBeat"
// 			}
// 			websock.send(JSON.stringify(heart));
// 			console.log("发送心跳包：HeartBeat");
// 		}
// 	}, 1800000);
// 	// }, 180);
// }
//
// // 实际调用的方法
// function sendSock(agentData, callback) {
// 	globalCallback = callback
// 	if (websock.readyState === websock.OPEN) {
// 		// 若是ws开启状态
// 		websocketsend(agentData)
// 	} else if (websock.readyState === websock.CONNECTING) {
// 		// 若是 正在开启状态，则等待1s后重新调用
// 		setTimeout(function() {
// 			sendSock(agentData, callback)
// 		}, 1000)
// 	} else {
// 		// 若未开启 ，则等待1s后重新调用
// 		setTimeout(function() {
// 			sendSock(agentData, callback)
// 		}, 1000)
// 	}
// }
// //实际调用--用户退出登录时----手动关闭ws连接
// function closews() {
// 	websock.close();
// }
// //实际调用--用户登录成功(login.vue)或刷新页面(app.vue)时--启动ws重新连接//用户刷新页面但是未登录不做处理
// function linkws() {
// 	initWebSocket()
// 	console.log('登录成功--开始连接.......')
// }
//
// // 数据接收  ---------将所需数据存到store里面
// function websocketonmessage(e) {
// 	var data = JSON.parse(e.data)
// 	// console.log(data)
// 	if (data.msg_type == "stat") { //实时数据图标展示
// 		var yingpan = data.fs_used / (data.fs_used + data.fs_free);
// 		var neicun = data.mem_used / data.mem_total;
// 		var msg = {
// 			//	  	  	  "flow":(data.ring_recv_bytes*8/1024/1024).toFixed(2),
// 			"flow": (data.recv_bytes * 8 / 1024 / 1024).toFixed(2),
// 			"meek": data.new_conns.TOR_MEEK,
// 			"tor": data.new_conns.TOR_DIRECT,
// 			"lwhttp": data.new_conns.ZERONET_TRACKER,
// 			"lwssl": data.new_conns.ZERONET_SSL,
// 			"tor2web": data.new_conns.TOR2WEB,
// 			"tempmail": data.new_conns.TEMPMAIL,
// 			"cpu": (100 - data.cpu_idl).toFixed(2), //cpu使用率
// 			"mem": (neicun * 100).toFixed(2), //内存使用率
// 			"fs": (yingpan * 100).toFixed(2), //硬盘使用率
// 		}
// 		store.commit("timedatafn", msg) //存储实时数据
// 		if ((yingpan * 100).toFixed(2) > 80) { //硬盘使用率超过80%自动提示
// 			if (isOver80 == false) {
// 				Message.warning('警告:硬盘使用率已超过80%!');
// 				isOver80 = true
// 			}
// 		} else {
// 			isOver80 = false;
// 		}
// 	};
// 	if (data.info == 'disk quota exceeded' && data.msg_type == "task_done") {
// 		if (isOver == false) {
// 			Message.warning('警告:硬盘使用率已超过80%!');
// 			isOver = true
// 		}
// 	} else {
// 		isOver = false;
// 	}
// 	if (data.msg_type == "task_done" && data.result == "success") { //流量导入结果回传
// 		var msg = {
// 			"action": data.action,
// 			"info": data.info,
// 			"result": data.result
// 		};
// 		store.commit("flowbackfn", msg) //存储实时数据
// 	};
// 	if (data.info == 'License invalid' && data.msg_type == "task_done") { //License失效--跳到license认证页面
// 		Message.error('License失效,请重新认证！');
// 		store.commit("isAuthorize", true);
// 		router.push('/authmessage')
// 	}
//
// 	//实时检测是否停止        lightnet_mode-->0在线  1离线     lightnet_heartbeat  0停止    >0启动
// 	if (data.lightnet_heartbeat == 0) {
// 		store.commit("isCheckfn", false) // 当前用户关闭了实时数据检测
// 	} else if (data.lightnet_heartbeat > 0) {
// 		store.commit("isCheckfn", true) // 当前用户开启了实时数据检测
// 	}
// 	if (data.type == "loginOut") { //用户二次登陆踢掉第一次登陆  并清空数据
// 		if (data.token == sessionStorage.getItem('token')) {
// 			router.push('/login')
// 			sessionStorage.setItem('isLogin', false)
// 			sessionStorage.setItem('sessionId', '')
// 			sessionStorage.setItem('token', '')
// 			sessionStorage.setItem('userId', '')
// 		}
// 	}
//
// 	// 铃声提示
// 	if (data.new_meek_conns > 0) {
// 		store.commit("newMeekfn", new Date().getTime())
// 	}
// }
//
// // 数据发送
// function websocketsend(agentData) {
// 	websock.send(JSON.stringify(agentData))
// }
//
// // 关闭
// function websocketclose(e) {
// 	console.log('连接关闭');
// 	if (interval) { //关闭连接请求定时器
// 		window.clearInterval(interval);
// 		console.log("清除定时器");
// 	}
// }
// // 创建 websocket 连接
// function websocketOpen(e) {
// 	console.log('连接成功')
// }
//
// //initWebSocket()  登录和页面刷新重新连接
//
// // 将方法暴露出去
// export {
// 	sendSock, //发送数据
// 	closews, //退出登录--手动关闭链接
// 	linkws, //登录成功--建立ws连接
// }
