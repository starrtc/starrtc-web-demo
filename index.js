//当前激活tab
var activeTab = "main";

//agentId，保留，当前未使用，默认为""
var agentId = "";
//userId 
var userId = "";

//各功能聊天室对话框
var videoMeetingMsgWindow = null;
var voipMsgWindow = null;
var videoLiveMsgWindow = null;
var superTalkMsgWindow = null;

// 集成文档请参考 https://docs.starrtc.com/en/docs/web-7.html

var aecRequestBaseURL = "https://www.starrtc.com/aec";				//开启AEC后，才生效，从此url获取各种列表信息
var privateURL = "demo.starrtc.com";								//后端服务地址，可为ip，也可为域名
var webrtcIP = "47.105.65.73";										//后端服务地址，必须为ip（目前只有chrome72以上支持设置成域名），webrtc ip，用于设置webrtc udp ip，用于setSrcServerInfo，setVdnServerInfo，setVoipServerInfo接口，不设置时与后端服务地址privateURL一致


/* var LOG_LEVEL = {
	LOG_LEVEL_DEBUG: i++,
	LOG_LEVEL_INFO: i++,
	LOG_LEVEL_WARN: i++,
	LOG_LEVEL_ERROR: i++ */

//设置日志等级，开启低等级日志会包含高等级日志，如开启DEBUG，则同时开启INFO、WARN、ERROR，默认为开启DEBUG
StarRtc.InitlogLevel(LOG_LEVEL.LOG_LEVEL_DEBUG);

//创建SDK对象
StarRtc.Instance = new StarRtc.StarSDK();

////////////////////////私有云改配置///////////////////////
///////////////////////以下privateURL需替换为私有部署IP////

//StarRtc.Instance.setConfigUseAEC(true);    							//是否开启AEC

StarRtc.Instance.setMsgServerInfo(privateURL, 19903) 					//ip, websocket port  //需要手动从浏览器输入 https://ip:29991 信任证书

StarRtc.Instance.setChatRoomServerInfo(privateURL, 19906) 			//ip, websocket port //需要手动从浏览器输入 https://ip:29993 信任证书

StarRtc.Instance.setSrcServerInfo(privateURL, 19934, 19935, webrtcIP)  			//ip, websocket port, webrtc port, webrtc ip//需要手动从浏览器输入 https://ip:29994 信任证书

StarRtc.Instance.setVdnServerInfo(privateURL, 19940, 19941, webrtcIP) 			//ip, websocket port, webrtc port, webrtc ip //需要手动从浏览器输入 https://ip:29995 信任证书

StarRtc.Instance.setVoipServerInfo(privateURL, 10086, 10087, 10088, webrtcIP) 	//ip, voipServer port, websocket port, webrtc port, webrtc ip //需要手动从浏览器输入 https://ip:29992 信任证书


//白板画布类
var MyCanvas = function (_id, _draw_mode, _draw_callback) {
	var id = _id;
	var draw_mode = false || _draw_mode;
	var draw_callback = null || _draw_callback;
	var canvasObj = $("#" + id);
	if (canvasObj == undefined) {
		return null;
	}
	var ctx = canvasObj[0].getContext('2d');
	ctx.fillStyle = 'rgba(255, 255, 255, 0)';

	var drawPoints = [];
	var points = {};
	points["-1"] = [];

	if (draw_mode) {
		canvasObj.unbind("mousedown");
		canvasObj.unbind("mousemove");
		canvasObj.unbind("mouseup");

		canvasObj.bind("mousedown", function (ev) {
			var ev = ev || window.event;

			ctx.strokeStyle = "red";
			ctx.lineCap = 'round';
			ctx.lineWidth = 4;

			drawPoints = [];

			ctx.beginPath();
			ctx.moveTo(ev.offsetX, ev.offsetY);
			drawPoints.push([ev.offsetX, ev.offsetY]);
			canvasObj.bind("mousemove", function (ev) {
				var ev = ev || window.event;
				ctx.lineTo(ev.offsetX, ev.offsetY);
				drawPoints.push([ev.offsetX, ev.offsetY]);
				ctx.stroke();
			});
		});

		canvasObj.bind("mouseup", function (ev) {
			canvasObj.unbind("mousemove");
			drawPoints.push([0, 0]);
			if (draw_callback != null) {
				draw_callback(drawPoints);
			}
			points["-1"] = points["-1"].concat(drawPoints);
		});
	}

	MyCanvas.prototype.addPoint = function (_id, x, y) {
		if (points[_id] == undefined) {
			points[_id] = [];
		}
		points[_id].push([x, y]);
	}

	MyCanvas.prototype.setSize = function (width, height) {
		canvasObj[0].width = width;
		canvasObj[0].height = height;
		ctx = canvasObj[0].getContext('2d');
		ctx.fillStyle = 'rgba(255, 255, 255, 0)';
	}

	MyCanvas.prototype.fitSize = function () {
		if (canvasObj[0].width != canvasObj[0].clientWidth || canvasObj[0].height != canvasObj[0].clientHeight) {
			this.setSize(canvasObj[0].clientWidth, canvasObj[0].clientHeight);
		}
	}

	MyCanvas.prototype.redraw = function () {
		this.fitSize();
		this.clearCanvas();
		for (var upId in points) {
			var count = 0;
			if ((count = points[upId].length) > 1) {
				var selectColor = "red";
				switch (upId) {
					case "-1":
						selectColor = "#FF6c00";
						break;
					case "0":
						selectColor = "#FF4081";
						break;
					case "1":
						selectColor = "yellow";
						break;
					case "2":
						selectColor = "blue";
						break;
					case "3":
						selectColor = "cyan";
						break;
					case "4":
						selectColor = "green";
						break;
					case "5":
						selectColor = "magenta";
						break;
					case "6":
						selectColor = "red";
						break;
				}

				ctx.lineCap = 'round';
				ctx.lineWidth = 4;
				ctx.strokeStyle = selectColor;

				var flag = false;
				var linePoints = 0;

				for (var i = 0; i < count; ++i) {
					if (!flag) {
						ctx.beginPath();
						ctx.moveTo(points[upId][i][0], points[upId][i][1]);
						flag = true;
						linePoints = 1;
					}
					else {
						if (points[upId][i][0] <= 0) {
							if (linePoints > 1) {
								ctx.stroke();
							}
							flag = false;
						}
						else {
							ctx.lineTo(points[upId][i][0], points[upId][i][1]);
							linePoints++;
						}
					}
				}
				if (flag && linePoints > 1) {
					ctx.stroke();
				}
			}
		}
	}

	MyCanvas.prototype.clearCanvas = function () {
		ctx.clearRect(0, 0, canvasObj[0].width, canvasObj[0].height);
	}

	MyCanvas.prototype.clearAll = function () {
		points = { "-1": [] };
		this.clearCanvas();
	}

	return this;
}

//点击返回触发的函数
var currFunc = {
	"exit": undefined
};

//登陆成功后界面设置
function loginSuccessViewSet() {
	switchLogin(false);
	$("#userId").html(userId);
	$("#userImage").html("<image src=\"images/user.png\" />");
	bindTabs(true);
	videoMeetingMsgWindow.userName = userId;
	videoMeetingMsgWindow.setShowHideCallBack(1000, null, 1000, function () {
		$("#videoMeetingVideoZone").css("width", "100%");
		$("#videoMeetingMessageButton").show();
	});
	superTalkMsgWindow.userName = userId;
	superTalkMsgWindow.setShowHideCallBack(1000, null, 1000, function () {
		$("#superTalkAudioZone").css("width", "100%");
		$("#superTalkMessageButton").show();
	});
	voipMsgWindow.userName = userId;
	voipMsgWindow.setShowHideCallBack(1000, null, 1000, function () {
		$("#voipVideoZone").css("width", "100%");
		$("#voipMessageButton").show();
	});
	videoLiveMsgWindow.userName = userId;
	videoLiveMsgWindow.setShowHideCallBack(1000, null, 1000, function () {
		$("#videoLiveVideoZone").css("width", "100%");
		$("#videoLiveMessageButton").show();
	});
}

//注销
function starlogout() {
	StarRtc.Instance.logout();
	bindTabs(false);
	$("#userImage").html("");
	userId = "";
	$("#userId").html("请先登录");
	switchLogin(true);
}

function switchLogin(flag) {
	$("#login").unbind("click");
	$("#login").bind("click", flag ? starlogin : starlogout);
	$("#login").html(flag ? "登录" : "退出");
}

function showMainTab() {
	activeTab = "main";
	$(".tab[id!=mainTab]").hide();
	$("#mainTab").slideDown(2000);
}

function showVoipTab() {
	activeTab = "voip";
	$(".tab").hide();
	$("#voipTab").slideDown(2000, enterVoipFunc);
}

function showVideoLiveTab() {
	activeTab = "videoLive";
	$(".tab").hide();
	$("#videoLiveTab").slideDown(2000, enterVideoLiveFunc);
}

function showVideoMeetingTab() {
	activeTab = "videoMeeting";
	$(".tab").hide();
	$("#videoMeetingTab").slideDown(2000, enterVideoMeetingFunc);
}

function showSuperTalkTab() {
	activeTab = "superTalk";
	$(".tab").hide();
	$("#superTalkTab").slideDown(2000, enterSuperTalkFunc);
}

function showSuperVideoTab() {
	activeTab = "superVideo";
	$(".tab").hide();
	$("#superVideoTab").slideDown(2000, enterSuperVideoFunc);
}

function bindTabs(flag) {
	if (flag) {
		$("#voipButton").bind("click", showVoipTab);
		$("#videoLiveButton").bind("click", showVideoLiveTab);
		$("#videoMeetingButton").bind("click", showVideoMeetingTab);
		$("#superTalkButton").bind("click", showSuperTalkTab);
		$("#superVideoButton").bind("click", showSuperVideoTab);
	}
	else {

		$("#voipButton").unbind("click");
		$("#videoLiveButton").unbind("click");
		$("#videoMeetingButton").unbind("click");
		$("#superTalkButton").unbind("click");
		$("#superVideoButton").unbind("click");
	}
}

function bindEvent() {
	$(".backButton").each(function (id, ele) {
		$(ele).bind("click", function () {
			showMainTab();
			if (currFunc.exit != undefined) {
				currFunc.exit();
			}
		});
	});

	$("#videoLiveApplyButton").bind("click", function () {
		videoLiveApplyDialog.dialog("open");
	});
	$("#videoCanvasButton").bind("click", videoLiveCanvasShow)

	$("#videoMeetingCreateButton").bind("click", videoMeetingCreateNewDlg);
	$("#videoMeetingMessageButton").bind("click", function () {
		$("#videoMeetingVideoZone").css("width", "85%");
		$("#videoMeetingVideoZone").css("float", "left");
		$("#videoMeetingMessageButton").hide();
		videoMeetingMsgWindow.show();
	});

	$("#superTalkStartTalkButton").bind("click", superTalkStartTalkDlg);
	$("#superTalkEndTalkButton").bind("click", superTalkEndTalkDlg);
	$("#superTalkCreateButton").bind("click", superTalkCreateNewDlg);
	$("#superTalkMessageButton").bind("click", function () {
		$("#superTalkAudioZone").css("width", "85%");
		$("#superTalkAudioZone").css("float", "left");
		$("#superTalkMessageButton").hide();
		superTalkMsgWindow.show();
	});

	$("#videoLiveCreateButton").bind("click", videoLiveCreateNewDlg);
	$("#videoLiveMessageButton").bind("click", function () {
		$("#videoLiveVideoZone").css("width", "85%");
		$("#videoLiveVideoZone").css("float", "left");
		$("#videoLiveMessageButton").hide();
		videoLiveMsgWindow.show();
	});

	$("#voipMessageButton").bind("click", function () {
		$("#voipVideoZone").css("width", "85%");
		$("#voipVideoZone").css("float", "left");
		$("#voipMessageButton").hide();
		voipMsgWindow.show();
	});

	$("#voipCalling").bind("click", openCallDlg);
	$("#voipHangup").bind("click", hangupVOIP);

	$("#voipSmallVideo").bind("click", switchVoipVideo);
	$("#voipBigVideo").bind("click", switchVoipVideo);

	$("#videoMeetingVideoCtrl").bind("click", videoMeetingSelfVideoCtrl);
	$("#videoMeetingAudioCtrl").bind("click", videoMeetingSelfAudioCtrl);
}
//////////////////////////////////////////////star box////////////////////////////////////////
function starlogin(evt, _userId) {
	//userId随机生成，类型为字符串
	if (_userId == undefined) {
		_userId = "" + (Math.floor(Math.random() * 899999) + 100000);
	}
	userId = _userId;
	$("#userImage").html("<div class=\"rect1\"></div>\n<div class=\"rect2\"></div>\n<div class=\"rect3\"></div>\n<div class=\"rect4\"></div>\n<div class=\"rect5\"></div>");
	setCookie("starrtc_userId", userId, null);
	//登录
	starRtcLogin(agentId, userId, starRtcLoginCallBack);
}

//登录时传入的回调函数，IM，群组，系统消息在此回调中处理
function starRtcLoginCallBack(data, status) {
	switch (status) {
		//链接状态
		case "connect success":
			break;
		case "connect failed":
			alert("登录连接失败!");
			break;
		case "connect closed":
			break;
		//收到登录消息
		case "onLoginMessage":
			if (data.status == "success") {
				loginSuccessViewSet();
			}
			console.log("login:" + data.status);
			break;
		//收到IM消息
		case "onSingleMessage":
			var fid = data.fromId;
			voipMsgWindow.displayMessage(data.fromId, data.msg.contentData, false);
			break;
		//收到群组消息
		case "onGroupMessage":
			break;
		//收到群组私聊消息
		case "onGroupPrivateMessage":
			break;
		//收到群组推送消息
		case "onGroupPushMessage":
			break;
		//收到系统推送消息
		case "onSystemPushMessage":
			break;
		//收到voip消息
		case "onVoipMessage":
			switch (data.type) {
				//收到voip视频呼叫消息
				case "voipCall":
					$("#callerId").html(data.fromId);
					$("#callerType").html("视频");
					voipAudio = false;
					voipResponseDlg.dialog("open");
					break;
				//收到voip音频呼叫消息
				case "voipAudioCall":
					$("#callerId").html(data.fromId);
					$("#callerType").html("音频");
					voipAudio = true;
					voipResponseDlg.dialog("open");
					break;
				//收到voip挂断消息
				case "voipHangup":
					voipResponseDlg.dialog("close");
					break;
				//收到voip拒绝消息
				case "voipRefuse":
					voipConnectDlg.dialog("close");
					$("#callerId").html("");
					alert("对方拒绝了通话！");
					break;
			}
			break;
		//收到错误消息
		case "onErrorMessage":
			switch (data.errId) {
				//收到重复登录消息
				case 2:
					alert("您的账号在另外的设备登录，您已经下线");
					$(".backButton")[0].click();
					starlogout();
					break;
			}
			break;
		//收到群组列表回调（仅非AEC）
		case "onGetGroupList":
			break;
		//收到在线人数回调
		case "onGetOnlineNumber":
			break;
		//收到推送群组成员回调（仅非AEC）
		case "onGetGroupUserList":
			break;
		//收到推送群组系统消息回调
		case "onGetAllUserList":
			break;
		//收到推送群组系统消息回调
		case "onPushGroupSystemMsgFin":
			break;
		//收到推送系统消息回调
		case "onPushSystemMsgFin":
			break;
		//收到取消免打扰回调（仅非AEC）
		case "onUnsetGroupMsgIgnoreFin":
			break;
		//收到设置免打扰回调（仅非AEC）
		case "onSetGroupMsgIgnoreFin":
			break;
		//收到移除群组成员回调
		case "onRemoveGroupUserFin":
			break;
		//收到添加群组成员回调
		case "onAddGroupUserFin":
			break;
		//收到删除群组回调
		case "onDelGroupFin":
			break;
		//收到创建群组回调
		case "onCreateGroupFin":
			break;
		//收到发送群组消息回调
		case "onSendGroupMsgFin":
			break;
	}
};

//登录函数
function starRtcLogin(agentId, userId, callBack) {
	//获取SDK版本
	StarRtc.Instance.version();
	//SDK登录函数
	StarRtc.Instance.login(agentId, userId, callBack);
}
//////////////////////////////////////////////star box end////////////////////////////////////////
//////////////////////////////////////////////videoMeeting////////////////////////////////////////
//房间列表
var videoMeetingIds;
//当前选中房间下标
var selectVideoMeetingIndex;

var videoMeetingCreateDialog;
var videoMeetingDelDialog;
//分享屏幕标志位
var meetingShareScreen = false;

//当前房间
var currRoom = null;

//流信息，用于切换大小图
var streamInfos = [];
//大图辅助变量
var oldBigVideo = -1;
var nowBigVideo = -1;

function streamInfo() {
	this.videoId = "";
	this.streamObj = null;
	this.switchFlag = false;
}

//初始化
function resetStreamInfos() {
	streamInfos = [];
	for (var i = 0; i < 7; ++i) {
		var stream = new streamInfo();
		streamInfos.push(stream);
	}
}

//切换大小图
function streamConfigChange(roomSDK, upId) {
	if (nowBigVideo == upId) {
		nowBigVideo = oldBigVideo;
		oldBigVideo = upId
	}
	else {
		oldBigVideo = nowBigVideo;
		nowBigVideo = upId;
	}

	var streamConfig = [];
	for (var i in streamInfos) {
		var conf = 0;
		if (oldBigVideo == nowBigVideo) {
			conf = !streamInfos[i].switchFlag ? 2 : 1;
		}
		else if (i == oldBigVideo) {
			conf = 1;
		}
		else if (i == nowBigVideo) {
			conf = 2;
		}
		else {
			conf = streamInfos[i].switchFlag ? 2 : 1
		}
		streamConfig.push(conf);
	}
	//切换大小图，streamConfig为数组，1为小图，2为大图[1,2,1,2...]，会触发streamConfig回调
	roomSDK.streamConfigApply(streamConfig);
}

//将stream中两个video track顺序对调，达到显示另一个流的效果
function switchStream(stream) {
	var tracks = [];
	stream.getVideoTracks().forEach(function (track) {
		tracks.push(track);
		stream.removeTrack(track);
	});

	for (var i = tracks.length - 1; i >= 0; i--) {
		stream.addTrack(tracks[i]);
	}
}

function switchStreamInfo(streamInfo) {
	if (streamInfo) {
		streamInfo.switchFlag = !streamInfo.switchFlag;
		switchStream(streamInfo.streamObj);
	}
}

function setStreamInfo(upId, videoId, stream) {
	if (streamInfos[upId]) {
		streamInfos[upId].videoId = videoId;
		streamInfos[upId].streamObj = stream;
	}
}

function getStreamInfo(upId) {
	return streamInfos[upId];
}

//当一个上传者被移除后，需要重置该位置的流，否则当下一个上传者使用该位置时，可能会出现流顺序问题导致的显示异常
function resetStreamInfo(streamInfo) {
	if (streamInfo.switchFlag) {
		switchStreamInfo(streamInfo);
	}
}

resetStreamInfos(streamInfos);

//进入视频会议tab
function enterVideoMeetingFunc() {
	currFunc.exit = exitVideoMeetingFunc;
	$("#videoMeetingList").html("");
	loadVideoMeetingList();
}

//获取视频会议列表，AEC，非AEC
function loadVideoMeetingList(_callback) {
	$("#videoMeetingList").html("");
	//视频会议的两种类型，标准类型，推流类型
	var listTypes = [CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_MEETING, CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_MEETING_PUSH];
	//开启AEC时
	if (StarRtc.Instance.starConfig.configUseAEC) {
		$.get(aecRequestBaseURL + "/list/query.php?listTypes=" + listTypes.join(","), function (data, status) {
			if (status === "success") {
				var obj = JSON.parse(data);
				if (obj.status == 1) {
					videoMeetingIds = [];
					//数据存储在obj.data中，为数组，单项存储在obj.data[i].data中，为json字符串，解析后结构为{"id", "name", "creator"}
					for (var i = 0; i < obj.data.length; i++) {
						var item = JSON.parse(decodeURIComponent(obj.data[i].data));
						videoMeetingIds.push(item);
						$("#videoMeetingList")[0].innerHTML +=
							"<div class='button2' onclick='openVideoMeeting(" + i + ")'>" + item.name + "</div>";
					}
					if (_callback != undefined) {
						_callback();
					}
				} else {
					$("videoMeetingList").html("获取失败");
				}
			} else {
				$("videoMeetingList").html("获取失败");
			}
		});
	}
	else {
		//仅供测试使用
		StarRtc.Instance.queryRoom(listTypes, function (status, listData) {
			videoMeetingIds = listData;
			//数据存储在listData中，为数组，单项结构为{"id", "name", "creator"}
			for (var i = 0; i < listData.length; i++) {
				var item = listData[i];
				$("#videoMeetingList")[0].innerHTML +=
					"<div class='button2' onclick='openVideoMeeting(" + i + ")'>" + item.name + "</div>";
			}
			if (_callback != undefined) {
				_callback();
			}
		});
	}

}

//进入视频会议
function openVideoMeeting(index, from) {
	if (selectVideoMeetingIndex == index) return;

	if (currRoom != null) {
		//离开房间
		currRoom.leaveRoom();
		//断开连接
		currRoom.sigDisconnect();
		currRoom = null;
	}

	selectVideoMeetingIndex = index;

	//获取视频会议SDK
	currRoom = StarRtc.Instance.getVideoMeetingRoomSDK("open", videoMeetingCallBack, { "roomInfo": videoMeetingIds[index] });
	//链接
	currRoom.sigConnect();
}

//加入视频会议后设置界面
function joinMeetingRoom(meetingInfo) {
	$('#videoMeetingTitle').html("");
	$('#videoMeetingTitle').html(meetingInfo.name);

	if (meetingInfo.creator == userId) {
		var delButton = $("<div style=\"width:25px;height:25px;position:absolute;left:10px;top:10px;background-image: url(images/exitMsgWindow.jpg);background-size: cover;cursor:pointer;z-index:1;\"></div>");
		delButton.bind("click", function () {
			videoMeetingDelDialog.dialog("open");
		});
		$('#videoMeetingTitle').append(delButton);
	}
}

//设置自己的本地视频流显示
function videoMeetingSetStream(object) {
	var selfVideo = $("#videoMeetingSelfVideo")[0];
	selfVideo.srcObject = object;
	selfVideo.play();
	$("#videoMeetingSelfVideoCtrl").show();
}

//视频会议回调函数
function videoMeetingCallBack(data, status, oper) {
	//视频会议SDK对象
	var thisRoom = data.obj;
	switch (status) {
		//链接状态
		case "connect success":
			switch (oper) {
				case "open":
					//创建视频流，会触发onWebrtcMessage中的streamCreated回调
					thisRoom.createStream();
					break;
				case "new":
					//创建新房间，会触发onWebrtcMessage中的createChannel回调
					thisRoom.createNew();
					break;
			}
			break;
		case "connect failed":
		case "connect closed":
			stopVideoMeeting();
			break;
		//收到聊天室回调
		case "onChatRoomMessage":
			switch (data.type) {
				//收到加入聊天室回调
				case "joinChatRoom":
					if (data.status == "success") { }
					else {
						alert(data.failedStatus);
					}
					break;
				//收到聊天室私聊消息
				case "recvChatPrivateMsg":
					videoMeetingMsgWindow.displayMessage(data.msg.fromId + "私信", data.msg.contentData, false);
					break;
				//收到聊天室消息
				case "recvChatMsg":
					videoMeetingMsgWindow.displayMessage(data.msg.fromId, data.msg.contentData, false);
					break;
				//收到聊天室被踢消息
				case "chatroomUserKicked":
					thisRoom.leaveRoom();
					alert("你已被踢出房间！");
					break;
				//收到服务器错误消息
				case "serverErr":
					alert("服务器错误：" + data.msg);
					break;
			}
			break;
		//收到视频相关回调
		case "onWebrtcMessage":
			switch (data.type) {
				//收到流创建回调
				case "streamCreated":
					if (data.status == "success") {
						videoMeetingSetStream(data.streamObj);
						switch (oper) {
							case "open":
								//加入房间
								thisRoom.joinRoom();
								break;
							case "new":
								thisRoom.joinRoom();
								break;
						}
					}
					else {
						alert("获取摄像头视频失败！请检查摄像头设备是否接入！error:" + data.error);
					}
					break;
				//收到src加入房间回调
				case "srcApplyUpload":
					if (data.status == "success") {
						//服务端录屏session id
						console.log("recSessionId:" + data.recSessionId);
						joinMeetingRoom(data.userData.roomInfo);
					}
					else {
						alert("上传申请失败");
					}
					console.log("收到srcApplyUpload:" + data.status);
					break;
				//收到添加新的上传者回调
				case "addUploader":
					var newVideoId = "webrtc_video_" + data.upUserId;
					//data.streamInfo.streamObj中有两个video track（对应大小图），默认情况下是小图video track顺序在前，更换大小图显示时，需要先向服务端发切换消息，切换成功后，再掉换大小图video track 顺序，哪个的顺序在前，显示哪个
					setStreamInfo(data.upId, newVideoId, data.streamInfo.streamObj);
					videoMeetingAddNewVideo(newVideoId, data.streamInfo.streamObj, function (evt) {
						streamConfigChange(thisRoom, data.upId);
					});
					break;
				//收到移除上传者回调
				case "removeUploader":
					var streamInfo = getStreamInfo(data.upId);
					//如果移除的用户是大图，则向服务端发送消息，切换回小图，使得下一位用户占据此位置时，发送的是小图，发送消息后会触发streamConfig回调，在回调中设置大小图流顺序
					if (nowBigVideo == data.upId) {
						streamConfigChange(thisRoom, data.upId);
					}
					var newVideoId = streamInfo.videoId;
					removeNewVideo($("#videoMeetingVideoZone"), $("#" + newVideoId));
					if (data.bigFlag) {
						var videos = $("#videoMeetingVideoZone").find("video[id!='videoMeetingSelfVideo']");
						if (videos.length > 0) {
							videos[videos.length - 1].click();
						}
					}
					break;
				//收到删除房间回调（废弃）,不会触发，以下代码是正常的删除逻辑，请在回调外使用
				case "delChannel":
					if (data.status == "success") {
						//开启AEC时，只需要在AEC列表中删除，不需要走此回调，也不需要调用对应删除函数，放在这个位置仅为示例
						if (StarRtc.Instance.starConfig.configUseAEC) {
							$.get(aecRequestBaseURL + "/list/del.php?userId=" + StarRtc.Instance.starUser.userId + "&listType=" + CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_MEETING.toString() + "&roomId=" + data.userData.roomInfo.id, function (data, status) {
								if (status === "success") {
									var obj = JSON.parse(data);
									if (obj.status == 1) {
										console.log("保存成功")
									} else {
										console.log("保存失败")
									}
								} else {
									console.log("保存失败")
								}
							});
						}
						else {
							//仅供测试使用
							StarRtc.Instance.delRoom(CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_MEETING.toString(), data.userData.roomInfo, function (status) {
								console.log("保存" + status);
							});
						}
						videoMeetingDelDialog.dialog("close");
						loadVideoMeetingList();
					}
					else {
						alert("删除视频会议失败");
					}
					break;
				//收到创建房间回调
				case "createChannel":
					if (data.status == "success") {
						//开启AEC时，需要在AEC列表中保存房间信息
						if (StarRtc.Instance.starConfig.configUseAEC) {
							$.get(aecRequestBaseURL + "/list/save.php?userId=" + StarRtc.Instance.starUser.userId + "&listType=" + CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_MEETING.toString() + "&roomId=" + data.userData.roomInfo.id + "&data=" + encodeURIComponent(JSON.stringify(data.userData.roomInfo)), function (data, status) {
								if (status === "success") {
									var obj = JSON.parse(data);
									if (obj.status == 1) {
										console.log("保存成功")
									} else {
										console.log("保存失败")
									}
								} else {
									console.log("保存失败")
								}
							});
						}
						else {
							//仅供测试使用
							StarRtc.Instance.reportRoom(CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_MEETING.toString(), data.userData.roomInfo, function (status) {
								console.log("保存" + status);
							});
						}
						videoMeetingCreateDialog.dialog("close");
						loadVideoMeetingList(function () {
							var index = -1;
							for (var i in videoMeetingIds) {
								if (videoMeetingIds[i].id == data.userData.roomInfo.id) {
									index = i;
								}
							}
							if (index >= 0) {
								selectVideoMeetingIndex = index;
							}
							else {
								selectVideoMeetingIndex = undefined;
							}
							if (meetingShareScreen) {
								//创建屏幕分享流
								thisRoom.createScreenCaptureStream();
							}
							else {
								//创建视频流
								thisRoom.createStream();
							}

						});
					}
					else {
						alert("创建失败:" + data.msg);
					}
					break;
				//设置大小图回调
				case "streamConfig":
					if (data.status == "success") {
						if (oldBigVideo == nowBigVideo) {
							var streamInfo = getStreamInfo(oldBigVideo);
							switchStreamInfo(streamInfo);
							break;
						}
						if (oldBigVideo != undefined) {
							var streamInfo = getStreamInfo(oldBigVideo);
							switchStreamInfo(streamInfo);
						}
						if (nowBigVideo != undefined) {
							var streamInfo = getStreamInfo(nowBigVideo);
							switchStreamInfo(streamInfo);
						}
					}
					else {

					}
					break;
				case "serverErr":
					alert("服务器错误：" + data.msg);
					break;
			}
			break;
	}
}

//停止视频会议后设置界面
function stopVideoMeeting() {
	//流信息，用于切换大小图
	resetStreamInfos(streamInfos);
	//大图辅助变量
	oldBigVideo = -1;
	nowBigVideo = -1;
	videoMeetingCreateDialog.dialog("close");
	videoMeetingDelDialog.dialog("close");
	selectVideoMeetingIndex = undefined;
	$('#videoMeetingTitle').html("");
	$("#videoMeetingSelfVideoCtrl").hide();
	$("#videoMeetingVideoZone").children().each(function (ids, ele) {
		var video = $(ele).children("video").first();
		if (video.attr("id") != "videoMeetingSelfVideo") {
			$(ele).remove();
		}
		else {
			video[0].srcObject = null;
		}
	});
}

//退出视频会议
function exitVideoMeetingFunc() {
	if (currRoom != null) {
		currRoom.leaveRoom();
		currRoom.sigDisconnect();
		currRoom = null;
	}
}

//添加新的视频对象
function videoMeetingAddNewVideo(newVideoId, stream, clickCallback) {
	var parentObj = $("#videoMeetingVideoZone");
	var wrapperObj = $("<div></div>");
	var videoObj = $("<video id=\"" + newVideoId + "\" style=\"width:100%;height:100%\"></video>");

	videoObj.bind("click", clickCallback);

	wrapperObj.append(videoObj);

	addNewVideo(parentObj, wrapperObj);

	videoObj[0].srcObject = stream;
	videoObj[0].play();
}

//创建视频会议对话框
function videoMeetingCreateNewDlg() {
	$("#newMeetingName").val("网页会议_" + userId);
	videoMeetingCreateDialog.dialog("open");
}

//创建视频会议
function videoMeetingCreateNewMeeting() {
	var newMeetingName = $("#newMeetingName").val();
	if (newMeetingName == "") {
		alert("会议室名称不能为空！");
	}
	else {

		if (currRoom != null) {
			//离开房间
			currRoom.leaveRoom();
			//断开连接
			currRoom.sigDisconnect();
			currRoom = null;
		}

		var type = $('#meetingTypecheck').is(':checked') ? 1 : 0;
		meetingShareScreen = $('#meetingMediaSourceTypeCheck').is(':checked');
		//获取视频会议SDK
		currRoom = StarRtc.Instance.getVideoMeetingRoomSDK("new", videoMeetingCallBack, {
			"roomInfo": {
				"creator": userId,
				"id": "",
				"name": newMeetingName,
				"Type": type
			}
		}
		);
		//链接
		currRoom.sigConnect();
	}
}

//删除视频会议房间（废弃）,删除房间请使用delroom接口
function videoMeetingDelMeeting() {
	if (currRoom != null) {
		currRoom.deleteCurrRoom();
	}
}

var videoEnable = true;
//控制视频会议自己的视频，影响其他人观看
function videoMeetingSelfVideoCtrl() {
	if (currRoom) {
		videoEnable = !videoEnable;
		if (videoEnable) {
			$("#videoMeetingVideoCtrl").css("background-image", "url(./images/icon-video.png)");
			currRoom.publishStream({ "video": true });
		}
		else {
			$("#videoMeetingVideoCtrl").css("background-image", "url(./images/icon-video-close.png)");
			currRoom.publishStream({ "video": false });
		}

	}
}

var audioEnable = true;
//控制视频会议自己的音频，影响其他人收听
function videoMeetingSelfAudioCtrl() {
	if (currRoom) {
		audioEnable = !audioEnable;
		if (audioEnable) {
			$("#videoMeetingAudioCtrl").css("background-image", "url(./images/icon-audio.png)");
			currRoom.publishStream({ "audio": true });
		}
		else {
			$("#videoMeetingAudioCtrl").css("background-image", "url(./images/icon-audio-close.png)");
			currRoom.publishStream({ "audio": false });
		}
	}
}

//////////////////////////////////////////////videoMeeting end////////////////////////////////
//////////////////////////////////////////////videoLive///////////////////////////////////////
//房间列表
var videoLiveIds;
//当前选中房间下标
var selectVideoLiveIndex;

var videoLiveCreateDialog;
var videoLiveDelDialog;
var videoLiveManageDialog;
var videoLiveMyCanvas = null;
var videoLiveCanvasDlg;
var videoLiveApplyDialog = null;
//分享屏幕标志位
var liveShareScreen = false;

//进入直播tab
function enterVideoLiveFunc() {
	currFunc.exit = exitVideoLiveFunc;
	$("#videoLiveList").html("");
	loadVideoLiveList();
}

function exitVideoLiveFunc() {
	if (currRoom != null) {
		currRoom.leaveRoom();
		currRoom.sigDisconnect();
		currRoom = null;
	}
}

//获取直播列表，AEC，非AEC
function loadVideoLiveList(_callback) {
	$("#videoLiveList").html("");
	//直播的两种类型，标准类型，推流类型
	var listTypes = [CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_LIVE, CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_LIVE_PUSH];
	//开启AEC时
	if (StarRtc.Instance.starConfig.configUseAEC) {
		$.get(aecRequestBaseURL + "/list/query.php?listTypes=" + listTypes.join(","), function (data, status) {
			if (status === "success") {
				var obj = JSON.parse(data);
				if (obj.status == 1) {
					videoLiveIds = [];
					//数据存储在obj.data中，为数组，单项存储在obj.data[i].data中，为json字符串，解析后结构为{"id", "name", "creator"}
					for (var i = 0; i < obj.data.length; i++) {
						var item = JSON.parse(decodeURIComponent(obj.data[i].data));
						videoLiveIds.push(item);
						$("#videoLiveList")[0].innerHTML +=
							"<div class='button2' onclick='openVideoLive(" + i + ")'>" + item.name + "</div>";
					}
					if (_callback != undefined) {
						_callback();
					}
				} else {
					$("videoLiveList").html("获取失败");
				}
			} else {
				$("videoLiveList").html("获取失败");
			}
		});
	}
	else {
		//仅供测试使用
		StarRtc.Instance.queryRoom(listTypes, function (status, listData) {
			videoLiveIds = listData;
			//数据存储在listData中，为数组，单项结构为{"id", "name", "creator"}
			for (var i = 0; i < listData.length; i++) {
				var item = listData[i];
				$("#videoLiveList")[0].innerHTML +=
					"<div class='button2' onclick='openVideoLive(" + i + ")'>" + item.name + "</div>";
			}
			if (_callback != undefined) {
				_callback();
			}
		});
	}
}

//加入直播后设置界面
function joinLiveRoom(liveInfo) {
	$('#videoLiveTitle').html("");
	$('#videoLiveTitle').html(liveInfo.name);

	if (liveInfo.creator == userId) {
		var delButton = $("<div style=\"width:25px;height:25px;position:absolute;left:10px;top:10px;background-image: url(images/exitMsgWindow.jpg);background-size: cover;cursor:pointer;z-index:1;\"></div>");
		delButton.bind("click", function () {
			videoLiveDelDialog.dialog("open");
		});
		$('#videoLiveTitle').append(delButton);
	}
}

//设置自己的本地视频流显示
function videoLiveSetStream(object) {
	$("#videoLiveSelfVideo").parent().show();
	var selfVideo = $("#videoLiveSelfVideo")[0];
	selfVideo.srcObject = object;
	selfVideo.play();
}

//直播上传者（SRC）回调函数
function videoLiveSrcCallBack(data, status, oper) {
	//直播房间SDK对象
	var thisRoom = data.obj;
	switch (status) {
		//链接状态
		case "connect success":
			switch (oper) {
				case "open":
					//创建视频流，会触发onWebrtcMessage中的streamCreated回调
					thisRoom.createStream();
					break;
				case "new":
					//创建新房间，会触发onWebrtcMessage中的createChannel回调
					thisRoom.createNew();
					break;
			}
			break;
		case "connect failed":
		case "connect closed":
			stopVideoLive();
			break;
		//收到视频相关回调
		case "onWebrtcMessage":
			{
				switch (data.type) {
					//收到流创建回调
					case "streamCreated":
						if (data.status == "success") {
							videoLiveSetStream(data.streamObj);
							switch (oper) {
								case "open":
									//加入房间
									thisRoom.joinRoom();
									break;
								case "new":
									thisRoom.joinRoom();
									break;
							}
						}
						else {
							alert("获取摄像头视频失败！请检查摄像头设备是否接入！error:" + data.error);
						}
						break;
					//收到src加入房间回调
					case "srcApplyUpload":
						if (data.status == "success") {
							//服务端录屏session id
							console.log("recSessionId:" + data.recSessionId);
							if (oper == "new") {
								videoLiveMyCanvas = new MyCanvas("videoLiveMyCanvas", true, canvasDrawCallback);
							}
							$("#videoLiveApplyButton").hide();
							$("#videoCanvasButton").show();
							joinLiveRoom(data.userData.roomInfo);
						}
						else {
							alert("上传视频申请失败！");
						}
						console.log("收到srcApplyUpload:" + data.status);
						break;
					//收到添加新的上传者回调
					case "addUploader":
						var newVideoId = "webrtc_video_" + data.upUserId;
						//data.streamInfo.streamObj中有两个video track（对应大小图），默认情况下是小图video track顺序在前，更换大小图显示时，需要先向服务端发切换消息，切换成功后，再掉换大小图video track 顺序，哪个的顺序在前，显示哪个
						setStreamInfo(data.upId, newVideoId, data.streamInfo.streamObj);
						videoLiveAddNewVideo(newVideoId, data.streamInfo.streamObj, function (evt) {
							streamConfigChange(thisRoom, data.upId);
						});
						break;
					//收到移除上传者回调
					case "removeUploader":
						var streamInfo = getStreamInfo(data.upId);
						//如果移除的用户是大图，则向服务端发送消息，切换回小图，使得下一位用户占据此位置时，发送的是小图，发送消息后会触发streamConfig回调，在回调中设置大小图流顺序
						if (nowBigVideo == data.upId) {
							streamConfigChange(thisRoom, data.upId);
						}
						var newVideoId = streamInfo.videoId;
						removeNewVideo($("#videoLiveVideoZone"), $("#" + newVideoId));
						if (data.bigFlag) {
							var videos = $("#videoLiveVideoZone").find("video[id!='videoLiveSelfVideo']");
							if (videos.length > 0) {
								videos[videos.length - 1].click();
							}
						}
						break;
					//收到删除房间回调（废弃）,不会触发，以下代码是正常的删除逻辑，请在回调外使用
					case "delChannel":
						if (data.status == "success") {
							//开启AEC时，只需要在AEC列表中删除，不需要走此回调，也不需要调用对应删除函数，放在这个位置仅为示例
							if (StarRtc.Instance.starConfig.configUseAEC) {
								$.get(aecRequestBaseURL + "/list/del.php?userId=" + StarRtc.Instance.starUser.userId + "&listType=" + CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_LIVE.toString() + "&roomId=" + data.userData.roomInfo.id, function (data, status) {
									if (status === "success") {
										var obj = JSON.parse(data);
										if (obj.status == 1) {
											console.log("保存成功")
										} else {
											console.log("保存失败")
										}
									} else {
										console.log("保存失败")
									}
								});
							}
							else {
								//仅供测试使用
								StarRtc.Instance.delRoom(CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_LIVE.toString(), data.userData.roomInfo, function (status) {
									console.log("保存" + status);
								});
							}
							videoLiveDelDialog.dialog("close");
							loadVideoLiveList();
						}
						else {
							alert("删除视频会议失败");
						}
						break;
					//收到创建房间回调
					case "createChannel":
						if (data.status == "success") {
							//开启AEC时，需要在AEC列表中保存房间信息
							if (StarRtc.Instance.starConfig.configUseAEC) {
								$.get(aecRequestBaseURL + "/list/save.php?userId=" + StarRtc.Instance.starUser.userId + "&listType=" + CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_LIVE.toString() + "&roomId=" + data.userData.roomInfo.id + "&data=" + encodeURIComponent(JSON.stringify(data.userData.roomInfo)), function (data, status) {
									if (status === "success") {
										var obj = JSON.parse(data);
										if (obj.status == 1) {
											console.log("保存成功")
										} else {
											console.log("保存失败")
										}
									} else {
										console.log("保存失败")
									}
								});
							}
							else {
								//仅供测试使用
								StarRtc.Instance.reportRoom(CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_LIVE.toString(), data.userData.roomInfo, function (status) {
									console.log("保存" + status);
								});
							}
							videoLiveCreateDialog.dialog("close");
							loadVideoLiveList(function () {
								var index = -1;
								for (var i in videoLiveIds) {
									if (videoLiveIds[i].id == data.userData.roomInfo.id) {
										index = i;
									}
								}
								if (index >= 0) {
									selectVideoLiveIndex = index;
								}
								else {
									selectVideoLiveIndex = undefined;
								}
								if (liveShareScreen) {
									//创建屏幕分享流
									thisRoom.createScreenCaptureStream();
								}
								else {
									//创建视频流
									thisRoom.createStream();
								}
							});
						}
						else {
							alert("创建失败:" + data.msg);
						}
						break;
					//收到streamData数据，此处是收到room sdk 的sendStreamData函数所发送来的自定义数据
					case "streamData":
						if (data.streamData != "CLEAN") {
							if (data.streamData.indexOf(",") != -1) {
								videoLiveCanvasDlg.dialog("open");
								var points = data.streamData.split("/");
								for (var i in points) {
									var point = points[i].split(",");
									videoLiveMyCanvas.addPoint(data.upId, parseInt(point[0]), parseInt(point[1]));
								}
								videoLiveMyCanvas.redraw();
							}
						}
						else {
							videoLiveMyCanvas.clearAll();
						}
						break;
					//设置大小图回调
					case "streamConfig":
						if (data.status == "success") {
							if (oldBigVideo == nowBigVideo) {
								var streamInfo = getStreamInfo(oldBigVideo);
								switchStreamInfo(streamInfo);
								break;
							}
							if (oldBigVideo != undefined) {
								var streamInfo = getStreamInfo(oldBigVideo);
								switchStreamInfo(streamInfo);
							}
							if (nowBigVideo != undefined) {
								var streamInfo = getStreamInfo(nowBigVideo);
								switchStreamInfo(streamInfo);
							}
						}
						else {

						}
						break;
					case "serverErr":
						alert("服务器错误：" + data.msg);
						break;
				}
			}
			break;
		//收到聊天室回调
		case "onChatRoomMessage":
			{
				switch (data.type) {
					//收到聊天室私聊消息
					case "recvChatPrivateMsg":
						//收到连麦结束消息
						if (data.msg.msgType == "linkStop") {
							openVideoLive(selectVideoLiveIndex);
						}
						//收到申请连麦消息
						else if (data.msg.msgType == "apply") {
							videoLiveManageDialog.userData = { "fromUserId": data.fromUserId };
							$("#applyTargetId").html(data.msg.fromId);
							videoLiveManageDialog.dialog("open");
						}
						//收到同意邀请连麦消息
						else if (data.msg.msgType == "inviteAgree") {

						}
						//收到拒绝邀请连麦消息
						else if (data.msg.msgType == "inviteDisagree") {
							alert(data.msg.fromId + "拒绝了您的连麦邀请！")
						}
						//收到普通聊天室私聊消息
						else {
							videoLiveMsgWindow.displayMessage(data.msg.fromId + "私信", data.msg.contentData, false);
						}
						break;
					//收到聊天室消息
					case "recvChatMsg":
						videoLiveMsgWindow.displayMessage(data.msg.fromId, data.msg.contentData, false);
						break;
					//收到聊天室被踢消息
					case "chatroomUserKicked":
						thisRoom.leaveRoom();
						alert("你已被踢出房间！");
						break;
					//收到删除聊天室回调
					case "deleteChatRoom":
						if (data.status == "success") {
							videoLiveDelDialog.dialog("close");
							loadVideoLiveList();
						}
						else {
							alert("删除聊天室失败");
						}
						break;
					//收到服务器错误消息
					case "serverErr":
						alert("服务器错误：" + data.msg);
						break;
				}
			}
			break;
	}
}

//直播观看者（VDN）回调函数
function videoLiveVdnCallBack(data, status, oper) {
	//直播SDK对象
	var thisRoom = data.obj;
	switch (status) {
		//链接状态
		case "connect success":
			switch (oper) {
				case "open":
					//创建视频流，会触发onWebrtcMessage中的streamCreated回调
					thisRoom.createStream();
					break;
				case "new":
					break;
			}
			break;
		case "connect failed":
		case "connect closed":
			stopVideoLive();
			break;
		//收到视频相关回调
		case "onWebrtcMessage":
			switch (data.type) {
				//收到流创建回调
				case "streamCreated":
					if (data.status == "success") {
						thisRoom.joinRoom();
					}
					else {
						alert("获取摄像头视频失败！请检查摄像头设备是否接入！error:" + data.error);
					}
					break;
				//收到vdn加入房间回调
				case "vdnApplyDownload":
					if (data.status == "success") {
						joinLiveRoom(data.userData.roomInfo);
						$("#videoLiveApplyButton").show();
					}
					else {
						alert("获取数据失败");
						console.log("收到vdnApplyDownload_failed");
						thisRoom.leaveRoom();
					}
					break;
				//收到添加新的上传者回调
				case "addUploader":
					var newVideoId = "webrtc_video_" + data.upUserId;
					//data.streamInfo.streamObj中有两个video track（对应大小图），默认情况下是小图video track顺序在前，更换大小图显示时，需要先向服务端发切换消息，切换成功后，再掉换大小图video track 顺序，哪个的顺序在前，显示哪个
					setStreamInfo(data.upId, newVideoId, data.streamInfo.streamObj);
					videoLiveAddNewVideo(newVideoId, data.streamInfo.streamObj, function (evt) {
						streamConfigChange(thisRoom, data.upId);
					});
					break;
				//收到移除上传者回调
				case "removeUploader":
					var streamInfo = getStreamInfo(data.upId);
					//如果移除的用户是大图，则向服务端发送消息，切换回小图，使得下一位用户占据此位置时，发送的是小图，发送消息后会触发streamConfig回调，在回调中设置大小图流顺序
					if (nowBigVideo == data.upId) {
						streamConfigChange(thisRoom, data.upId);
					}
					var newVideoId = streamInfo.videoId;
					removeNewVideo($("#videoMeetingVideoZone"), $("#" + newVideoId));
					if (data.bigFlag) {
						var videos = $("#videoLiveVideoZone").find("video[id!='videoLiveSelfVideo']");
						if (videos.length > 0) {
							videos[videos.length - 1].click();
						}
					}
					break;
				//收到streamData数据，此处是收到room sdk 的sendStreamData函数所发送来的自定义数据
				case "streamData":
					videoLiveCanvasDlg.dialog("open");
					if (data.streamData != "CLEAN") {
						var points = data.streamData.split("/");
						for (var i in points) {
							var point = points[i].split(",");
							videoLiveMyCanvas.addPoint(data.upId, parseInt(point[0]), parseInt(point[1]));
						}
						videoLiveMyCanvas.redraw();
					}
					else {
						videoLiveMyCanvas.clearAll();
					}
					break;
				//设置大小图回调
				case "streamConfig":
					if (data.status == "success") {
						if (oldBigVideo == nowBigVideo) {
							var streamInfo = getStreamInfo(oldBigVideo);
							switchStreamInfo(streamInfo);
							break;
						}
						if (oldBigVideo != undefined) {
							var streamInfo = getStreamInfo(oldBigVideo);
							switchStreamInfo(streamInfo);
						}
						if (nowBigVideo != undefined) {
							var streamInfo = getStreamInfo(nowBigVideo);
							switchStreamInfo(streamInfo);
						}
					}
					else {

					}
					break;
				case "serverErr":
					alert("服务器错误：" + data.msg);
					break;
			}
			break;
		//收到聊天室回调
		case "onChatRoomMessage":
			{
				switch (data.type) {
					//收到聊天室私聊消息
					case "recvChatPrivateMsg":
						//收到同意连麦以及邀请连麦开始消息
						if (data.msg.msgType == "applyAgree" || data.msg.msgType == "inviteStart") {
							openVideoLive(selectVideoLiveIndex, "applyAgree");
						}
						//收到连麦结束消息
						else if (data.msg.msgType == "linkStop") {
							openVideoLive(selectVideoLiveIndex);
						}
						//收到拒绝连麦消息
						else if (data.msg.msgType == "applyDisagree") {
							alert("房主拒绝了连麦申请");
						}
						//收到邀请连麦消息
						else if (data.msg.msgType == "invite") {

						}
						//收到普通聊天室私聊消息
						else {
							videoLiveMsgWindow.displayMessage(data.msg.fromId + "私信", data.msg.contentData, false);
						}
						break;
					//收到聊天室消息
					case "recvChatMsg":
						videoLiveMsgWindow.displayMessage(data.msg.fromId, data.msg.contentData, false);
						break;
					//收到聊天室被踢消息
					case "chatroomUserKicked":
						thisRoom.leaveRoom();
						alert("你已被踢出房间！");
						break;
					//收到服务器错误消息
					case "serverErr":
						alert("服务器错误：" + data.msg);
						break;
				}
			}
			break;
	}
}

//停止直播后设置界面
function stopVideoLive() {
	//流信息，用于切换大小图
	resetStreamInfos(streamInfos);
	//大图辅助变量
	oldBigVideo = -1;
	nowBigVideo = -1;
	if (videoLiveMyCanvas != undefined) {
		videoLiveMyCanvas.clearAll();
	}
	$("#videoLiveApplyButton").hide();
	$("#videoCanvasButton").hide();
	videoLiveCreateDialog.dialog("close");
	videoLiveDelDialog.dialog("close");
	selectVideoLiveIndex = undefined;
	$('#videoLiveTitle').html("");
	$("#videoLiveVideoZone").children().each(function (ids, ele) {
		var video = $(ele).children("video").first();
		if (video.attr("id") != "videoLiveSelfVideo") {
			$(ele).remove();
		}
		else {
			video[0].srcObject = null;
		}
	});
}

//添加新的视频对象
function videoLiveAddNewVideo(newVideoId, stream, clickCallback) {

	var parentObj = $("#videoLiveVideoZone");
	var wrapperObj = $("<div></div>");
	var videoObj = $("<video id=\"" + newVideoId + "\" style=\"width:100%;height:100%\"></video>");

	videoObj.bind("click", clickCallback);

	wrapperObj.append(videoObj);

	addNewVideo(parentObj, wrapperObj);

	videoObj[0].srcObject = stream;
	videoObj[0].play();
}

function addNewVideo(parentObj, videoObject) {
	var childrenObjs = parentObj.children();

	switch (childrenObjs.length) {
		case 0:
			videoObject.css({ "width": "100%", "height": "100%", "float": "left" });
			break;
		case 1:
			childrenObjs.css({ "width": "50%", "height": "100%", "float": "left" });
			videoObject.css({ "width": "50%", "height": "100%", "float": "left" });
			break;
		case 2:
			childrenObjs.css({ "width": "33.33%", "height": "100%", "float": "left" });
			videoObject.css({ "width": "33.33%", "height": "100%", "float": "left" });
			break;
		case 3:
			childrenObjs.css({ "width": "50%", "height": "50%", "float": "left" });
			videoObject.css({ "width": "50%", "height": "50%", "float": "left" });
			break;
		case 4:
			childrenObjs.css({ "width": "33.33%", "height": "100%", "float": "left" });
			videoObject.css({ "width": "33.33%", "height": "100%", "float": "left" });
			break;
		case 5:
			childrenObjs.css({ "width": "33.33%", "height": "50%", "float": "left" });
			videoObject.css({ "width": "33.33%", "height": "50%", "float": "left" });
			break;
		case 6:
			childrenObjs.css({ "width": "33.33%", "height": "100%", "float": "left" });
			videoObject.css({ "width": "33.33%", "height": "100%", "float": "left" });
			break;
	}
	parentObj.append(videoObject);
}

function removeNewVideo(parentObj, videoObject) {
	if (videoObject != undefined) {
		videoObject.parent().remove();
		var childrenObjs = parentObj.children();

		switch (childrenObjs.length) {
			case 1:
				childrenObjs.css({ "width": "100%", "height": "100%", "float": "left" });
				break;
			case 2:
				childrenObjs.css({ "width": "50%", "height": "100%", "float": "left" });
				break;
			case 3:
				childrenObjs.css({ "width": "33.33%", "height": "100%", "float": "left" });
				break;
			case 4:
				childrenObjs.css({ "width": "50%", "height": "50%", "float": "left" });
				break;
			case 5:
				childrenObjs.css({ "width": "33.33%", "height": "50%", "float": "left" });
				break;
			case 6:
				childrenObjs.css({ "width": "33.33%", "height": "50%", "float": "left" });
				break;
		}
	}
}

//进入直播
function openVideoLive(index, from) {

	var tmpFrom = from || "";

	if (selectVideoLiveIndex == index && tmpFrom != "applyAgree") return;
	if (currRoom != null) {
		currRoom.leaveRoom();
		currRoom.sigDisconnect();
		currRoom = null;
	}

	selectVideoLiveIndex = index;

	if (videoLiveIds[index].creator == userId || tmpFrom == "applyAgree") {
		videoLiveMyCanvas = new MyCanvas("videoLiveMyCanvas", true, canvasDrawCallback);
		var a = $("#videoLiveSelfVideo");
		if ($("#videoLiveSelfVideo").length == 0) {
			videoLiveAddNewVideo("videoLiveSelfVideo", null, null);
			$("#videoLiveSelfVideo").attr("muted", "true");
		}
		//获取直播SDK，上传者、创建者
		currRoom = StarRtc.Instance.getVideoLiveRoomSDK("src", "open", videoLiveSrcCallBack, { "roomInfo": videoLiveIds[index] });
	}
	else {
		videoLiveMyCanvas = new MyCanvas("videoLiveMyCanvas", true, canvasDrawCallback);
		if ($("#videoLiveSelfVideo").length > 0) {
			removeNewVideo($("#videoMeetingVideoZone"), $("#videoLiveSelfVideo"));
		}

		//获取直播SDK，观看者
		currRoom = StarRtc.Instance.getVideoLiveRoomSDK("vdn", "open", videoLiveVdnCallBack, { "roomInfo": videoLiveIds[index] });

	}
	//链接
	currRoom.sigConnect();
}

//直播白板界面
function videoLiveCanvasShow() {
	if (videoLiveMyCanvas != null) {
		videoLiveCanvasDlg.dialog("open");
	}
}

//清除直播白板
function videoLiveCleanCanvas() {
	if (videoLiveMyCanvas != null && currRoom != null) {
		videoLiveMyCanvas.clearAll();
		currRoom.sendStreamData("CLEAN");
	}
}

//白板绘制回调
function canvasDrawCallback(points) {
	if (currRoom) {
		var data = points.join("/");
		currRoom.sendStreamData(data);
	}
}

//创建直播对话框
function videoLiveCreateNewDlg() {
	$("#newLiveName").val("网页直播_" + userId);
	videoLiveCreateDialog.dialog("open");
}

//创建直播
function videoLiveCreateNewLive() {
	var newLiveName = $("#newLiveName").val();
	if (newLiveName == "") {
		alert("直播名称不能为空！");
	}
	else {

		if (currRoom != null) {
			//离开房间
			currRoom.leaveRoom();
			//断开连接
			currRoom.sigDisconnect();
			currRoom = null;
		}

		var type = $('#liveTypecheck').is(':checked') ? 1 : 0;
		liveShareScreen = $('#liveMediaSourceTypeCheck').is(':checked');
		if ($("#videoLiveSelfVideo").length == 0) {
			videoLiveAddNewVideo("videoLiveSelfVideo", null, null);
			$("#videoLiveSelfVideo").attr("muted", "true");
		}
		currRoom = StarRtc.Instance.getVideoLiveRoomSDK("src", "new", videoLiveSrcCallBack, {
			"roomInfo": {
				"creator": userId,
				"id": "",
				"name": newLiveName,
				"Type": type
			}
		}
		);
		currRoom.sigConnect();
	}
}

//删除直播房间
function videoLiveDelLive() {
	//if(selectVideoLiveIndex != undefined)
	{
		if (currRoom != null) {
			currRoom.deleteCurrRoom();
		}
	}
}

//发送房间聊天室消息
function videoLiveInputMsgCallBack(msg) {
	if (currRoom != null) {
		currRoom.sendChatMsg(msg);
	}
}

//发送连麦申请
function videoLiveVdnApply() {
	if (currRoom != null) {
		currRoom.sendApplyMsg();
	}
	videoLiveApplyDialog.dialog("close");
}

//房间踢人
function videoLiveKickOutUser() {
	if (currRoom != null) {
		var kickOutUserId = $("#applyTargetId").html();
		currRoom.kickOutUser(kickOutUserId);
	}
}

function videoLiveBanToSendMsg() {

}

function videoLiveSendPrivateMsg() {

}

//同意连麦
function videoLiveApplyAgree() {
	if (currRoom != null) {
		var userId = $("#applyTargetId").html();
		currRoom.sendApplyAgreeMsg(userId);
	}
	videoLiveManageDialog.dialog("close");
}

//结束连麦
function videoLiveLinkStop() {
	if (currRoom != null) {
		var userId = $("#applyTargetId").html();
		currRoom.sendLinkStopMsg(userId);
	}
}

//////////////////////////////////////////////videoLive end///////////////////////////////////
//////////////////////////////////////////////voip////////////////////////////////////////////

var voipResponseDlg;
var voipConnectDlg;
var voipCallDlg;
//voip 仅音频标志位
var voipAudio = false;

function enterVoipFunc() {
	currFunc.exit = exitVoipFunc;
}

//退出voip
function exitVoipFunc() {
	if (currRoom != null) {
		currRoom.leaveRoom();
		currRoom.sigDisconnect();
		currRoom = null;
	}
}

//打开voip呼叫页面
function openCallDlg() {
	var targetUid = $('#targetUserId').val().trim();
	if (targetUid == null || targetUid == undefined || targetUid == "") {
		alert("对方ID不能为空");
		return;
	}
	$("#calleeId").html(targetUid);
	voipCallDlg.dialog("open");
}

//开始voip呼叫
function callingVOIP() {
	var targetUid = $('#targetUserId').val().trim();
	if (targetUid == null || targetUid == undefined || targetUid == "") {
		alert("对方ID不能为空");
		return;
	}
	voipCallDlg.dialog("close");

	voipAudio = $('#voipTypeAudioOnly').is(':checked');

	//获取voipSDK
	currRoom = StarRtc.Instance.getVoipRoomSDK("call", voipCallBack, { "roomInfo": { "targetId": targetUid, "audioOnly": voipAudio } });
	//链接
	currRoom.sigConnect();
	voipConnectDlg.dialog("open");
}

//挂断voip
function hangupVOIP() {
	exitVoipFunc();
}

//voip回调函数
function voipCallBack(data, status, oper) {
	var thisRoom = data.obj;
	switch (status) {
		//链接状态
		case "connect success":
			//创建视频流，会触发onWebrtcMessage中的streamCreated回调
			thisRoom.createStream();
			break;
		case "connect failed":
		case "connect closed":
			stopVoip();
			break;
		//收到视频相关回调
		case "onWebrtcMessage":
			switch (data.type) {
				//收到流创建回调
				case "streamCreated":
					if (data.status == "success") {
						voipSetStream($("#voipSmallVideo")[0], data.streamObj);
						//加入房间
						thisRoom.joinRoom();
					}
					else {
						voipConnectDlg.dialog("close");
						alert("获取摄像头视频失败！请检查摄像头设备是否接入！error:" + data.error);
					}
					break;
				//收到voip 呼叫回调
				case "voipCalling":
					if (data.status == "success") {
						//服务端录屏session id
						console.log("recSessionId:" + data.recSessionId);
					}
					break;
				//收到voip 应答回调
				case "voipResponseing":
					if (data.status == "success") {
						//服务端录屏session id
						console.log("recSessionId:" + data.recSessionId);
						$('#targetUserId').val(data.userData.roomInfo.targetId);
					}
					break;
				//收到voip 通话成功后，获取到对方视频流
				case "voipStreamReady":
					if (data.userData.roomInfo.audioOnly) {
						voipSetStream($("#voipBigAudio")[0], data.streamObj);
					}
					else {
						voipSetStream($("#voipBigVideo")[0], data.streamObj);
					}
					break;
			}
			break;
		//收到voip IM 消息
		case "onVoipMessage":
			switch (data.type) {
				//收到voip 拒绝通话
				case "voipRefuse":
					voipConnectDlg.dialog("close");
					$("#callerId").html("");
					alert("对方拒绝了通话！");
					thisRoom.sigDisconnect();
					break;
				//收到voip 挂断通话
				case "voipHangup":
					alert("对方挂断了通话！");
					thisRoom.sigDisconnect();
					break;
				//收到voip 通话链接
				case "voipConnect":
					voipConnectDlg.dialog("close");
					break;
				//收到voip 对方忙碌
				case "voipBusy":
					alert("对方正忙！");
					thisRoom.sigDisconnect();
					break;
				//收到voip IM 聊天消息
				case "voipSingleMsg":
					voipMsgWindow.displayMessage(data.fromId, data.msg.contentData, false);
					break;
			}
			break;
	}
}

function voipSetStream(videoObj, streamObj) {
	videoObj.srcObject = streamObj;
	videoObj.play();
}

var voipMode = true;
function switchVoipVideo() {
	$("#voipSmallVideo")[0].style = "float:left;";
	$("#voipBigVideo")[0].style = "";
	if (voipMode) {
		$("#voipSmallVideo").animate({ "max-width": "85%", "height": "100%" }, 1000);
		$("#voipBigVideo").animate({ "width": "15%", "max-height": "100%" }, 1000);
	}
	else {
		$("#voipBigVideo").animate({ "max-width": "85%", "height": "100%" }, 1000);
		$("#voipSmallVideo").animate({ "width": "15%", "max-height": "100%" }, 1000);
	}
	voipMode = !voipMode;
}

//voip 同意接受对方呼叫
function voipAcceptCall() {
	if (currFunc.exit != undefined) {
		currFunc.exit();
	}
	showVoipTab();

	var targetId = $("#callerId").html();
	//获取voipSDK
	currRoom = StarRtc.Instance.getVoipRoomSDK("response", voipCallBack, { "roomInfo": { "targetId": targetId, "audioOnly": voipAudio } });
	//链接
	currRoom.sigConnect();
	voipResponseDlg.dialog("close");
}

//voip 拒绝接受对方呼叫
function voipRefuseCall() {
	var targetId = $("#callerId").html();
	StarRtc.Instance.sendVoipRefuseMsg(targetId);
	voipResponseDlg.dialog("close");
}

//voip 取消呼叫
function voipCancleCall() {
	hangupVOIP();
	voipConnectDlg.dialog("close");
}

//停止voip
function stopVoip() {
	currRoom = null;
	voipResponseDlg.dialog("close");
	voipConnectDlg.dialog("close");
	voipCallDlg.dialog("close");
	$("#callerId").html("");
	$('#targetUserId').val("");
	$("#voipBigVideo")[0].srcObject = null;
	$("#voipSmallVideo")[0].srcObject = null;
}

//voip 发送消息
function voipInputMsgCallBack(msg) {
	if (currRoom != null) {
		currRoom.sendVoipMsg(msg);
	}
}

//////////////////////////////////////////////void end////////////////////////////////////////
//////////////////////////////////////////////superTalk start////////////////////////////////////
//房间列表
var superTalkIds;
//当前选中房间下标
var selectSuperTalkIndex;

var superTalkCreateDialog;
var superTalkDelDialog;
var superTalkStartTalkDialog;
var superTalkEndTalkDialog;
var superTalkStartTalkConnectDlg;

//进入超级对讲tab
function enterSuperTalkFunc() {
	currFunc.exit = exitSuperTalkFunc;
	$("#superTalkList").html("");
	loadSuperTalkList();
}

function exitSuperTalkFunc() {
	if (currRoom != null) {
		currRoom.leaveRoom();
		currRoom.sigDisconnect();
		currRoom = null;
	}
}

//获取超级对讲列表，AEC，非AEC
function loadSuperTalkList(_callback) {
	$("#superTalkList").html("");
	//超级房间的两种类型，标准类型，推流类型
	var listTypes = [CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_SUPER_ROOM, CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_SUPER_ROOM_PUSH];
	//开启AEC时
	if (StarRtc.Instance.starConfig.configUseAEC) {
		$.get(aecRequestBaseURL + "/list/query.php?listTypes=" + listTypes.join(","), function (data, status) {
			if (status === "success") {
				var obj = JSON.parse(data);
				if (obj.status == 1) {
					superTalkIds = [];

					//数据存储在obj.data中，为数组，单项存储在obj.data[i].data中，为json字符串，解析后结构为{"id", "name", "creator"}
					for (var i = 0; i < obj.data.length; i++) {
						var item = JSON.parse(decodeURIComponent(obj.data[i].data));
						superTalkIds.push(item);
						$("#superTalkList")[0].innerHTML +=
							"<div class='button2' onclick='openSuperTalk(" + i + ")'>" + item.name + "</div>";
					}
					if (_callback != undefined) {
						_callback();
					}
				} else {
					$("superTalkList").html("获取失败");
				}
			} else {
				$("superTalkList").html("获取失败");
			}
		});
	}
	else {
		//仅供测试使用
		StarRtc.Instance.queryRoom(listTypes, function (status, listData) {
			superTalkIds = listData;
			//数据存储在listData中，为数组，单项结构为{"id", "name", "creator"}
			for (var i = 0; i < listData.length; i++) {
				var item = listData[i];
				$("#superTalkList")[0].innerHTML +=
					"<div class='button2' onclick='openSuperTalk(" + i + ")'>" + item.name + "</div>";
			}
			if (_callback != undefined) {
				_callback();
			}
		});
	}

}

//超级对讲回调函数
function superTalkCallBack(data, status, oper) {
	//超级对讲房间SDK对象
	var thisRoom = data.obj;
	switch (status) {
		//链接状态
		case "connect success":
			switch (oper) {
				case "open":
					//创建视频流，会触发onWebrtcMessage中的streamCreated回调
					thisRoom.createStream();
					break;
				case "new":
					//创建新房间，会触发onWebrtcMessage中的createChannel回调
					thisRoom.createNew();
					break;
			}
			break;
		case "connect failed":
		case "connect closed":
			stopSuperTalk();
			break;
		//收到视频相关回调
		case "onWebrtcMessage":
			switch (data.type) {
				//收到创建房间回调
				case "createChannel":
					if (data.status == "success") {
						//开启AEC时，需要在AEC列表中保存房间信息
						if (StarRtc.Instance.starConfig.configUseAEC) {
							$.get(aecRequestBaseURL + "/list/save.php?userId=" + StarRtc.Instance.starUser.userId + "&listType=" + CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_SUPER_ROOM.toString() + "&roomId=" + data.userData.roomInfo.id + "&data=" + encodeURIComponent(JSON.stringify(data.userData.roomInfo)), function (data, status) {
								if (status === "success") {
									var obj = JSON.parse(data);
									if (obj.status == 1) {
										console.log("保存成功")
									} else {
										console.log("保存失败")
									}
								} else {
									console.log("保存失败")
								}
							});
						}
						else {
							//仅供测试使用
							StarRtc.Instance.reportRoom(CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_SUPER_ROOM.toString(), data.userData.roomInfo, function (status) {
								console.log("保存" + status);
							});
						}
						superTalkCreateDialog.dialog("close");
						loadSuperTalkList(function () {
							var index = -1;
							for (var i in superTalkIds) {
								if (superTalkIds[i].id == data.userData.roomInfo.id) {
									index = i;
								}
							}
							if (index >= 0) {
								selectSuperTalkIndex = index;
							}
							else {
								selectSuperTalkIndex = undefined;
							}
							//创建视频流
							thisRoom.createStream();
						});
					}
					break;
				//收到删除房间回调（废弃）,不会触发，以下代码是正常的删除逻辑，请在回调外使用
				case "delChannel":
					if (data.status == "success") {
						//开启AEC时，只需要在AEC列表中删除，不需要走此回调，也不需要调用对应删除函数，放在这个位置仅为示例
						if (StarRtc.Instance.starConfig.configUseAEC) {
							$.get(aecRequestBaseURL + "/list/del.php?userId=" + StarRtc.Instance.starUser.userId + "&listType=" + CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_SUPER_ROOM.toString() + "&roomId=" + data.userData.roomInfo.id, function (data, status) {
								if (status === "success") {
									var obj = JSON.parse(data);
									if (obj.status == 1) {
										console.log("保存成功")
									} else {
										console.log("保存失败")
									}
								} else {
									console.log("保存失败")
								}
							});
						}
						else {
							//仅供测试使用
							StarRtc.Instance.delRoom(CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_SUPER_ROOM.toString(), data.userData.roomInfo, function (status) {
								console.log("保存" + status);
							});
						}
						superTalkDelDialog.dialog("close");
						loadSuperTalkList();
					}
					else {
						alert("删除视频会议失败");
					}
					break;
				//收到流创建回调
				case "streamCreated":
					if (data.status == "success") {
						//加入房间
						thisRoom.joinRoom();
					}
					else {
						alert("创建流失败！请检查摄像头设备是否接入！error:" + data.error);
					}
					superTalkStartTalkConnectDlg.dialog("close");
					break;
				//收到src加入房间回调（即开始说话回调）
				case "srcApplyUpload":
					if (data.status == "success") {
						//服务端录屏session id
						console.log("recSessionId:" + data.recSessionId);
						alert("开启说话成功");
						$("#superTalkEndTalkButton").show();
						$("#superTalkStartTalkButton").hide();
					}
					else {
						alert("开启说话失败");
						$("#superTalkEndTalkButton").hide();
						$("#superTalkStartTalkButton").show();
					}
					superTalkStartTalkConnectDlg.dialog("close");
					console.log("收到srcApplyUpload:" + data.status);
					break;
				//收到vdn加入房间回调（即加入房间回调）
				case "vdnApplyDownload":
					if (data.status == "success") {
						joinSuperTalkRoom(data.userData.roomInfo);
						$("#superTalkStartTalkButton").show();
					}
					else {
						alert("获取数据失败");
						console.log("收到vdnApplyDownload_failed");
						thisRoom.leaveRoom();
					}
					break;
				//收到添加新的上传者回调
				case "addUploader":
					setStreamInfo(data.upId, "", data.streamInfo.streamObj);
					superTalkSetUploader(true, data.upId, data.upUserId, data.streamInfo.streamObj, data.upUserId == StarRtc.Instance.starUser.starUid);
					break;
				//收到移除上传者回调
				case "removeUploader":
					var streamInfo = getStreamInfo(data.upId);
					resetStreamInfo(streamInfo);
					superTalkSetUploader(false, data.upId, data.upUserId, streamInfo.streamObj, data.upUserId == StarRtc.Instance.starUser.starUid);
					break;
				case "serverErr":
					alert("服务器错误：" + data.msg);
					break;
			}
			break;
		//收到聊天室回调
		case "onChatRoomMessage":
			{
				switch (data.type) {
					//收到聊天室私聊消息
					case "recvChatPrivateMsg":
						superTalkMsgWindow.displayMessage(data.msg.fromId + "私信", data.msg.contentData, false);
						break;
					//收到聊天室消息
					case "recvChatMsg":
						superTalkMsgWindow.displayMessage(data.msg.fromId, data.msg.contentData, false);
						break;
					//收到聊天室被踢消息
					case "chatroomUserKicked":
						thisRoom.leaveRoom();
						alert("你已被踢出房间！");
						break;
					//收到服务器错误消息
					case "serverErr":
						alert("服务器错误：" + data.msg);
						break;
				}
			}
			break;
	}
}

//停止超级对讲后设置界面
function stopSuperTalk() {
	//流信息，用于切换大小图
	resetStreamInfos(streamInfos);
	//大图辅助变量
	oldBigVideo = -1;
	nowBigVideo = -1;
	superTalkCreateDialog.dialog("close");
	superTalkDelDialog.dialog("close");
	superTalkStartTalkDialog.dialog("close");
	superTalkEndTalkDialog.dialog("close");
	superTalkStartTalkConnectDlg.dialog("close");
	$("#superTalkEndTalkButton").hide();
	$("#superTalkStartTalkButton").hide();
	selectSuperTalkIndex = undefined;
	$('#superTalkTitle').html("");
	$("#superTalkAudioZone").children().each(function (ids, ele) {
		$(ele).hide();
	});
}

//加入超级对讲后设置界面
function joinSuperTalkRoom(roomInfo) {
	$('#superTalkTitle').html("");
	$('#superTalkTitle').html(roomInfo.name);

	if (roomInfo.creator == userId) {
		var delButton = $("<div style=\"width:25px;height:25px;position:absolute;left:10px;top:10px;background-image: url(images/exitMsgWindow.jpg);background-size: cover;cursor:pointer;z-index:1;\"></div>");
		delButton.bind("click", function () {
			superTalkDelDialog.dialog("open");
		});
		$('#superTalkTitle').append(delButton);
	}
}

//设置远程流界面显示
function superTalkSetUploader(flag, upId, userId, stream, isSelf) {
	var container = $("#superTalkUser" + upId);
	var userName = $("#superTalkUserName" + upId);
	var audio = $("#superTalkAudioUser" + upId);
	if (flag) {
		var tmp = userId.split("_");
		if (tmp.length == 2) {
			userName.html(tmp[1]);
		}
		else {
			userName.html(tmp[0]);
		}
		container.show();
		if (!isSelf) {
			audio[0].srcObject = stream;
		}
	}
	else {
		container.hide();
		audio[0].srcObject = null;
	}
}

//进入超级对讲
function openSuperTalk(index) {
	if (selectSuperTalkIndex == index) return;
	if (currRoom != null) {
		currRoom.leaveRoom();
		currRoom.sigDisconnect();
		currRoom = null;
	}

	selectSuperTalkIndex = index;
	//获取超级对讲SDK
	currRoom = StarRtc.Instance.getSuperRoomSDK("open", superTalkCallBack, { "roomInfo": superTalkIds[index] });
	//链接
	currRoom.sigConnect();
}

//创建超级对讲
function superTalkCreateNew() {
	var newSuperTalkName = $("#newSuperTalkName").val();
	if (newSuperTalkName == "") {
		alert("超级聊天室名称不能为空！");
	}
	else {

		if (currRoom != null) {
			//离开房间
			currRoom.leaveRoom();
			//断开连接
			currRoom.sigDisconnect();
			currRoom = null;
		}

		//获取超级对讲SDK
		currRoom = StarRtc.Instance.getSuperRoomSDK("new", superTalkCallBack, {
			"roomInfo": {
				"creator": userId,
				"id": "",
				"name": newSuperTalkName,
			}
		}
		);
		//链接
		currRoom.sigConnect();
	}
}

//开始对讲
function superTalkStartTalk() {
	if (currRoom) {
		currRoom.startTalk();
		superTalkStartTalkDialog.dialog("close");
		superTalkStartTalkConnectDlg.dialog("open");
	}
}

//结束对讲
function superTalkEndTalk() {
	if (currRoom) {
		currRoom.endTalk();
	}
	superTalkEndTalkDialog.dialog("close");
	$("#superTalkEndTalkButton").hide();
	$("#superTalkStartTalkButton").show();
}

function superTalkStartTalkDlg() {
	superTalkStartTalkDialog.dialog("open");
}

function superTalkEndTalkDlg() {
	superTalkEndTalkDialog.dialog("open");
}

function superTalkCreateNewDlg() {
	$("#newSuperTalkName").val("网页超级对讲_" + userId);
	superTalkCreateDialog.dialog("open");
}
//////////////////////////////////////////////superTalk end//////////////////////////////////////
//////////////////////////////////////////////superVideo start///////////////////////////////////

SuperVideoSDK = function (flag, roomInfo, dom, callback) {

	var self = this;
	var starRoomSDK = null;
	var domEle = dom;
	var domVideoSet = false;

	var videoEle = $(domEle).children("video").first();
	var nameEle = $(domEle).children(".title").first();

	var userId = "" + Math.floor(Math.random() * 899999) + 100000;

	var starSDK = new StarRtc.StarSDK();

	var loginStatus = false;

	starSDK.setMsgServerInfo(privateURL, 19903) 					//ip, websocket port  //需要手动从浏览器输入 https://ip:29991 信任证书

	starSDK.setChatRoomServerInfo(privateURL, 19906) 			//ip, websocket port //需要手动从浏览器输入 https://ip:29993 信任证书

	starSDK.setSrcServerInfo(privateURL, 19934, 19935, webrtcIP)  			//ip, websocket port, webrtc port, webrtc ip//需要手动从浏览器输入 https://ip:29994 信任证书

	starSDK.setVdnServerInfo(privateURL, 19940, 19941, webrtcIP) 			//ip, websocket port, webrtc port, webrtc ip //需要手动从浏览器输入 https://ip:29995 信任证书

	starSDK.setVoipServerInfo(privateURL, 10086, 10087, 10088, webrtcIP) 	//ip, voipServer port, websocket port, webrtc port, webrtc ip //需要手动从浏览器输入 https://ip:29992 信任证书

	//登录回调
	var loginCallBack = function (data, status) {
		data.sdk = self;
		switch (status) {
			//链接状态
			case "connect success":
				break;
			case "connect failed":
			case "connect closed":
				loginStatus = false;
				break;
			//收到登录消息
			case "onLoginMessage":
				if (data.status == "success") {
					loginStatus = true;
				}
				console.log("login:" + data.status);
				callback(data, status);
				break;
			//收到消息
			case "onSingleMessage":
				break;
			case "onGroupMessage":
				break;
			case "onGroupPrivateMessage":
				break;
			case "onGroupPushMessage":
				break;
			case "onSystemPushMessage":
				break;
			case "onVoipMessage":
				break;
			case "onErrorMessage":
				switch (data.errId) {
					case 2:
						alert("您的账号在另外的设备登录");
						starSDK.logout();
						break;
				}
				break;
			case "onGetGroupList":
				break;
			case "onGetOnlineNumber":
				break;
			case "onGetGroupUserList":
				break;
			case "onGetAllUserList":
				break;
			case "onPushGroupSystemMsgFin":
				break;
			case "onPushSystemMsgFin":
				break;
			case "onUnsetGroupMsgIgnoreFin":
				break;
			case "onSetGroupMsgIgnoreFin":
				break;
			case "onRemoveGroupUserFin":
				break;
			case "onAddGroupUserFin":
				break;
			case "onDelGroupFin":
				break;
			case "onCreateGroupFin":
				break;
			case "onSendGroupMsgFin":
				break;
		}
	}

	//视频回调
	var videoCallBack = function (data, status, oper) {
		data.sdk = self;
		//房间SDK对象
		var thisRoom = data.obj;
		switch (status) {
			//链接状态
			case "connect success":
				//创建视频流，会触发onWebrtcMessage中的streamCreated回调
				thisRoom.createStream();
				callback(data, status);
				break;
			case "connect failed":
			case "connect closed":
				starRoomSDK = null;
				callback(data, status);
				break;
			//收到视频相关回调
			case "onWebrtcMessage":
				switch (data.type) {
					//收到流创建回调
					case "streamCreated":
						if (data.status == "success") {
							//加入房间
							thisRoom.joinRoom();
						}
						else {

						}
						break;
					//收到src加入房间回调（会议）
					case "srcApplyUpload":
						if (data.status == "success") {

						}
						else {
							nameEle.html(roomInfo.name + "加入会议失败");
							thisRoom.leaveRoom();
						}
						console.log("收到srcApplyUpload:" + data.status);
						break;
					//收到vdn加入房间回调（直播观看者）
					case "vdnApplyDownload":
						if (data.status == "success") {

						}
						else {
							nameEle.html(roomInfo.name + "没有直播源");
							thisRoom.leaveRoom();
						}
						console.log("收到vdnApplyDownload:" + data.status);
						callback(data, status);
						break;
					//收到添加新的上传者回调，目前仅监控房间中的一个视频，其他上传者视频可自行实现
					case "addUploader":
						if (!domVideoSet) {
							domVideoSet = true;
							$(domEle).show();
							nameEle.html(roomInfo.name + "_" + data.upUserId);
							videoEle[0].srcObject = data.streamInfo.streamObj;
							videoEle[0].play();
						}
						break;
					//收到移除上传者回调
					case "removeUploader":
						if (domVideoSet) {
							domVideoSet = false;
							$(domEle).hide();
							nameEle.html("");
							videoEle[0].srcObject = null;
						}
						break;
					case "serverErr":
						alert("服务器错误：" + data.msg);
						break;
				}
				break;
		}
	}

	//登录
	starSDK.login("", userId, loginCallBack);

	//开始监控
	self.start = function () {
		if (loginStatus) {
			if (flag) {
				//获取会议SDK
				starRoomSDK = starSDK.getVideoMeetingRoomSDK("open", videoCallBack, { "roomInfo": roomInfo });
			}
			else {
				//获取直播SDK
				starRoomSDK = starSDK.getVideoLiveRoomSDK("vdn", "open", videoCallBack, { "roomInfo": roomInfo });
			}
			//链接
			starRoomSDK.sigConnect();
		}
	}

	//停止
	self.stop = function () {
		if (starRoomSDK) {
			starRoomSDK.leaveRoom();
			starRoomSDK.sigDisconnect();
			starRoomSDK = null;
		}
	}

	//重新登录
	self.reLogin = function () {
		if (loginStatus) {
			starSDK.logout();
		}
		userId = "" + Math.floor(Math.random() * 899999) + 100000;
		starSDK.login("", userId, "", loginCallBack);
	}

	//登出
	self.logout = function () {
		starSDK.logout();
	}

	return this;
}
//超级监控所有列表
var superVideoRooms = [];
function enterSuperVideoFunc() {
	currFunc.exit = exitSuperVideoFunc;
	$("#superTalkList").html("");
}

//退出超级监控
function exitSuperVideoFunc() {
	for (var i in superVideoRooms) {
		superVideoRooms[i].stop();
		superVideoRooms[i].logout();
	}
	superVideoRooms = [];
}


//登录回调
function callback(data, status) {
	switch (status) {
		case "onLoginMessage":
			if (data.status == "success") {
				data.sdk.start();
			}
			console.log("login:" + data.status);
			break;
	}
}


//打开超级会议监控，获取所有会议列表，目前只获取前七个
function openSuperVideoMeeting() {
	if (superVideoRooms.length != 0) {
		exitSuperVideoFunc();
	}
	//会议的两种类型，标准类型，推流类型
	var listTypes = [CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_MEETING, CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_MEETING_PUSH];
	//开启AEC时
	if (StarRtc.Instance.starConfig.configUseAEC) {
		$.get(aecRequestBaseURL + "/list/query.php?listTypes=" + listTypes.join(","), function (data, status) {
			if (status === "success") {
				var obj = JSON.parse(data);
				if (obj.status == 1) {
					//数据存储在obj.data中，为数组，单项存储在obj.data[i].data中，为json字符串，解析后结构为{"id", "name", "creator"}
					for (var i = 0; i < obj.data.length && i <= 7; i++) {
						var item = JSON.parse(decodeURIComponent(obj.data[i].data));
						//每个房间创建一个对象
						var room = new SuperVideoSDK(true, item, $("#superVideo" + i), callback);
						superVideoRooms.push(room);
					}
				}
			}
		});
	}
	else {
		//仅供测试使用
		StarRtc.Instance.queryRoom(listTypes, function (status, listData) {
			//数据存储在listData中，为数组，单项结构为{"id", "name", "creator"}
			for (var i = 0; i < listData.length && i <= 7; i++) {
				var item = listData[i];
				var room = new SuperVideoSDK(true, item, $("#superVideo" + i), callback)
				superVideoRooms.push(room);
			}
		});
	}
}

//打开超级直播监控，获取所有直播列表，目前只获取前七个
function openSuperVideoLive() {
	if (superVideoRooms.length != 0) {
		exitSuperVideoFunc();
	}
	//直播的两种类型，标准类型，推流类型
	var listTypes = [CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_LIVE, CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_LIVE_PUSH];
	//开启AEC时
	if (StarRtc.Instance.starConfig.configUseAEC) {
		$.get(aecRequestBaseURL + "/list/query.php?listTypes=" + listTypes.join(","), function (data, status) {
			if (status === "success") {
				var obj = JSON.parse(data);
				if (obj.status == 1) {
					//数据存储在obj.data中，为数组，单项存储在obj.data[i].data中，为json字符串，解析后结构为{"id", "name", "creator"}
					for (var i = 0; i < obj.data.length && i <= 7; i++) {
						var item = JSON.parse(decodeURIComponent(obj.data[i].data));
						//每个房间创建一个对象
						var room = new SuperVideoSDK(false, item, $("#superVideo" + i), callback);
						superVideoRooms.push(room);
					}
				}
			}
		});
	}
	else {
		//仅供测试使用
		StarRtc.Instance.queryRoom(listTypes, function (status, listData) {
			for (var i = 0; i < listData.length && i <= 7; i++) {
				var item = listData[i];
				var room = new SuperVideoSDK(false, item, $("#superVideo" + i), callback)
				superVideoRooms.push(room);
			}
		});
	}
}
//////////////////////////////////////////////superVideo end/////////////////////////////////////

function showAndroidQr() {
	var evt = event || window.event;
	var x = evt.clientX;
	var y = evt.clientY - 300;


	$("#android_app").css({ "left": x + "px", "top": y + "px", "display": "block", "zIndex": "999" });

	//document.getElementById("android_app").style.left = x + "px";
	//document.getElementById("android_app").style.top = y + "px";		
	//document.getElementById("android_app").style.display='block';
	//document.getElementById("android_app").style.zIndex='999';
}
function hideAndroidQr() {
	document.getElementById("android_app").style.display = 'none';
}

function showiOSQr() {
	var evt = event || window.event;
	var x = evt.clientX;
	var y = evt.clientY - 300;

	document.getElementById("ios_app").style.left = x + "px";
	document.getElementById("ios_app").style.top = y + "px";

	document.getElementById("ios_app").style.display = 'block';
	document.getElementById("ios_app").style.zIndex = '999';
}
function hideiOSQr() {
	document.getElementById("ios_app").style.display = 'none';
}

$().ready(function () {

	showMainTab();

	var fullHeight = $($(".tab")[0]).height();
	var fullWidth = $($(".tab")[0]).width();
	var backButtonHeight = $($(".backButton")[0]).height() + 20;

	$("#videoMeetingList").height(fullHeight - backButtonHeight);
	$("#videoMeetingZone").height(fullHeight - backButtonHeight);

	$("#videoLiveList").height(fullHeight - backButtonHeight);
	$("#videoLiveZone").height(fullHeight - backButtonHeight);

	$("#voipCtrl").height(fullHeight - backButtonHeight);
	$("#voipZone").height(fullHeight - backButtonHeight);

	$("#superTalkList").height(fullHeight - backButtonHeight);
	$("#superTalkZone").height(fullHeight - backButtonHeight);

	$("#superVideoList").height(fullHeight - backButtonHeight);
	$("#superVideoZone").height(fullHeight - backButtonHeight);

	videoMeetingMsgWindow = new MyMsgWindow("videoMeetingMsgWindow", videoLiveInputMsgCallBack);
	voipMsgWindow = new MyMsgWindow("voipMsgWindow", voipInputMsgCallBack);
	videoLiveMsgWindow = new MyMsgWindow("videoLiveMsgWindow", videoLiveInputMsgCallBack);
	superTalkMsgWindow = new MyMsgWindow("superTalkMsgWindow", videoLiveInputMsgCallBack);

	$("#videoLiveMsgWindow").hide();
	$("#videoMeetingMsgWindow").hide();
	$("#voipMsgWindow").hide();
	$("#videoLiveApplyButton").hide();
	$("#videoCanvasButton").hide();
	$("#superTalkMsgWindow").hide();

	$("#videoMeetingSelfVideoCtrl").hide();

	$("#videoLiveSelfVideo").parent().hide();

	voipResponseDlg = $("#voipResponseDlg").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"同意": voipAcceptCall,
			"拒绝": voipRefuseCall
		},
		open: function (event, ui) {
			$(".ui-dialog-titlebar-close").hide();
		},
	});

	voipConnectDlg = $("#voipConnectDlg").dialog({
		autoOpen: false,
		height: 220,
		width: 300,
		modal: true,
		buttons: {
			"取消呼叫": voipCancleCall
		},
		open: function (event, ui) {
			$(".ui-dialog-titlebar-close").hide();
		},
	});

	voipCallDlg = $("#voipCallDlg").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"确定": callingVOIP,
			"取消": function () {
				voipCallDlg.dialog("close");
			}
		}
	});

	videoMeetingCreateDialog = $("#videoMeetingCreateDlg").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"创建": videoMeetingCreateNewMeeting,
			"取消": function () {
				videoMeetingCreateDialog.dialog("close");
			}
		},
	});

	videoMeetingDelDialog = $("#videoMeetingDelDlg").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"确定": exitVideoMeetingFunc,
			"取消": function () {
				videoMeetingDelDialog.dialog("close");
			}
		},
	});

	superTalkEndTalkDialog = $("#superTalkEndTalkDlg").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"结束": superTalkEndTalk,
			"取消": function () {
				superTalkEndTalkDialog.dialog("close");
			}
		},
	});

	superTalkStartTalkDialog = $("#superTalkStartTalkDlg").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"开始": superTalkStartTalk,
			"取消": function () {
				superTalkStartTalkDialog.dialog("close");
			}
		},
	});

	superTalkCreateDialog = $("#superTalkCreateDlg").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"创建": superTalkCreateNew,
			"取消": function () {
				superTalkCreateDialog.dialog("close");
			}
		},
	});

	superTalkDelDialog = $("#superTalkDelDlg").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"确定": exitSuperTalkFunc,
			"取消": function () {
				superTalkDelDialog.dialog("close");
			}
		},
	});

	superTalkStartTalkConnectDlg = $("#superTalkStartTalkConnectDlg").dialog({
		autoOpen: false,
		height: 220,
		width: 300,
		modal: true,
		open: function (event, ui) {
			$(".ui-dialog-titlebar-close").hide();
		},
	});

	videoLiveApplyDialog = $("#videoLiveApplyDlg").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"确定": videoLiveVdnApply,
			"取消": function () {
				videoLiveApplyDialog.dialog("close");
			}
		},
	});

	videoLiveManageDialog = $("#videoLiveManageDlg").dialog({
		autoOpen: false,
		height: 200,
		width: 500,
		modal: true,
		buttons: {
			/*  "踢出": videoLiveKickOutUser,
			 "禁言": videoLiveBanToSendMsg,
	 "私信": videoLiveSendPrivateMsg, */
			"同意": videoLiveApplyAgree,
			"拒绝": function () {
				videoLiveManageDialog.dialog("close");
			}
			/* "下麦": videoLiveLinkStop, */
		},
	});

	videoLiveCreateDialog = $("#videoLiveCreateDlg").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"创建": videoLiveCreateNewLive,
			"取消": function () {
				videoLiveCreateDialog.dialog("close");
			}
		},
	});

	videoLiveDelDialog = $("#videoLiveDelDlg").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"确定": exitVideoLiveFunc,
			"取消": function () {
				videoLiveDelDialog.dialog("close");
			}
		},
	});

	videoLiveCanvasDlg = $("#videoLiveCanvasDlg").dialog({
		autoOpen: false,
		height: 800,
		width: 400,
		modal: true,
		buttons: {
			"确定": function () {
				videoLiveCanvasDlg.dialog("close");
			},
			"清除": videoLiveCleanCanvas
		},
	});

	$("#liveTypecheck").checkboxradio();
	$("#meetingTypecheck").checkboxradio();
	$("#liveMediaSourceTypeCheck").checkboxradio();
	$("#meetingMediaSourceTypeCheck").checkboxradio();
	$("#voipTypeAudioOnly").checkboxradio();


	var localId = getCookie("starrtc_userId");
	if (localId != "") {
		userId = localId;

		starRtcLogin(agentId, userId, starRtcLoginCallBack);
	}
	else {
		switchLogin(true);
	}

	bindEvent();

	$("#sdkVersion").html(StarRtc.Instance.version());
});
