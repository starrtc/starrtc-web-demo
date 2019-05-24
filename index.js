var activeTab = "main";

var agentId = "stargWeHN8Y7";
var userId = "";
var authKey = "";

var videoMeetingMsgWindow = null;
var voipMsgWindow = null;
var videoLiveMsgWindow = null;
var videoLiveApplyDialog = null;

var tmpStream;

////////////////////////共有云私有云区别搜索 StarRtc.Instance.configModePulic 查看

////////////////////////私有云改配置///////////////////////
///////////////////////以下10.90.7.70需替换为私有部署IP////

//StarRtc.Instance.setConfigModePulic(false);

//StarRtc.Instance.setMsgServerInfo("10.90.7.70", 19903) 					//ip, websocket port  //需要手动从浏览器输入 https://10.90.7.70:29991 信任证书

//StarRtc.Instance.setchatRoomServerInfo("10.90.7.70", 19906) 			//ip, websocket port //需要手动从浏览器输入 https://10.90.7.70:29993 信任证书

//StarRtc.Instance.setSrcServerInfo("10.90.7.70", 19934, 19935)  			//ip, websocket port, webrtc port //需要手动从浏览器输入 https://10.90.7.70:29994 信任证书

//StarRtc.Instance.setVdnServerInfo("10.90.7.70", 19940, 19941) 			//ip, websocket port, webrtc port //需要手动从浏览器输入 https://10.90.7.70:29995 信任证书

//StarRtc.Instance.setVoipServerInfo("10.90.7.70", 10086, 10087, 10088) 	//ip, voipServer port, websocket port, webrtc port //需要手动从浏览器输入 https://10.90.7.70:29992 信任证书

//StarRtc.Instance.setWebrtcServerIP("10.90.7.70");

////////////////////////公有云改配置///////////////////////

//StarRtc.Instance.setConfigModePulic(true);

//StarRtc.Instance.setLoginServerUrl("ips2.starrtc.com");

//StarRtc.Instance.setMsgScheduleUrl("ips2.starrtc.com");

//StarRtc.Instance.setChatRoomScheduleUrl("ips2.starrtc.com");

//StarRtc.Instance.setSrcScheduleUrl("ips2.starrtc.com");

//StarRtc.Instance.setVdnScheduleUrl("ips2.starrtc.com");

//StarRtc.Instance.setVoipServerUrl("ips2.starrtc.com");

//StarRtc.Instance.setWorkServerUrl("https://api.starrtc.com/public");

//StarRtc.Instance.setWebrtcServerIP("192.168.0.1");


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

var currFunc = {
	"exit": undefined
};

function loginSuccessViewSet() {
	switchLogin(false);
	$("#userId").html(userId);
	$("#userImage").html("<image src=\"images/user.png\" />");
	bindTabs(true);
	videoMeetingMsgWindow.userName = userId;
	videoMeetingMsgWindow.setShowHideCallBack(1000, null, 1000, function () {
		$("#videoMeetingVideoZone").css("width", "100%");
		$("#vidoeMeetingMessageButton").show();
	});
	voipMsgWindow.userName = userId;
	voipMsgWindow.setShowHideCallBack(1000, null, 1000, function () {
		$("#voipVideoZone").css("width", "100%");
		$("#voipMessageButton").show();
	});
	videoLiveMsgWindow.userName = userId;
	videoLiveMsgWindow.setShowHideCallBack(1000, null, 1000, function () {
		$("#videoLiveVideoZone").css("width", "100%");
		$("#vidoeLiveMessageButton").show();
	});
}

function starlogout() {
	StarRtc.Instance.logout();
	bindTabs(false);
	$("#userImage").html("");
	userId = "";
	authKey = "";
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

function showIotCarTab() {
	activeTab = "iotCar";
	$(".tab").hide();
	$("#iotCarTab").slideDown(2000, enterIotCarFunc);
}


function bindTabs(flag) {
	if (flag) {
		$("#voipButton").bind("click", showVoipTab);
		$("#videoLiveButton").bind("click", showVideoLiveTab);
		$("#videoMeetingButton").bind("click", showVideoMeetingTab);
		$("#iotCarButton").bind("click", showIotCarTab);
	}
	else {

		$("#voipButton").unbind("click");
		$("#videoLiveButton").unbind("click");
		$("#videoMeetingButton").unbind("click");
		$("#iotCarButton").unbind("click");
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

	$("#vidoeLiveApplyButton").bind("click", function () {
		videoLiveApplyDialog.dialog("open");
	});
	$("#vidoeCanvasButton").bind("click", videoLiveCanvasShow)

	$("#vidoeMeetingCreateButton").bind("click", vidoeMeetingCreateNewDlg);
	$("#vidoeMeetingMessageButton").bind("click", function () {
		$("#videoMeetingVideoZone").css("width", "85%");
		$("#videoMeetingVideoZone").css("float", "left");
		$("#vidoeMeetingMessageButton").hide();
		videoMeetingMsgWindow.show();
	});

	$("#vidoeLiveCreateButton").bind("click", vidoeLiveCreateNewDlg);
	$("#vidoeLiveMessageButton").bind("click", function () {
		$("#videoLiveVideoZone").css("width", "85%");
		$("#videoLiveVideoZone").css("float", "left");
		$("#vidoeLiveMessageButton").hide();
		videoLiveMsgWindow.show();
	});

	$("#voipMessageButton").bind("click", function () {
		$("#voipVideoZone").css("width", "85%");
		$("#voipVideoZone").css("float", "left");
		$("#voipMessageButton").hide();
		voipMsgWindow.show();
	});

	$("#voipCalling").bind("click", callingVOIP);
	$("#voipHangup").bind("click", hangupVOIP);

	$("#voipSmallVideo").bind("click", switchVoipVideo);
	$("#voipBigVideo").bind("click", switchVoipVideo);

	$("#iotCarCtrlUp").bind("mousedown", function () {
		iotCarCtrl("up");
	});
	$("#iotCarCtrlDown").bind("mousedown", function () {
		iotCarCtrl("down")
	});
	$("#iotCarCtrlLeft").bind("mousedown", function () {
		iotCarCtrl("left");
	});
	$("#iotCarCtrlRight").bind("mousedown", function () {
		iotCarCtrl("right");
	});
	$("#iotCarStart").bind("click", startIotCar);
}
//////////////////////////////////////////////star box////////////////////////////////////////
function starlogin(evt, _userId) {
	if (_userId == undefined) {
		_userId = "" + (Math.floor(Math.random() * 899999) + 100000);
	}
	userId = _userId;
	$("#userImage").html("<div class=\"rect1\"></div>\n<div class=\"rect2\"></div>\n<div class=\"rect3\"></div>\n<div class=\"rect4\"></div>\n<div class=\"rect5\"></div>");
	setCookie("starrtc_userId", userId, null);
	if (StarRtc.Instance.configModePulic) {
		$.get(StarRtc.Instance.workServerUrl + "/authKey.php?userid=" + userId + "&appid=" + agentId, function (data, status) {
			if (status === "success") {
				var obj = JSON.parse(data);
				if (obj.status == 1) {
					authKey = obj.data;
					setCookie("starrtc_authKey", authKey, null);

					loginSuccessViewSet();

					starRtcLogin(agentId, userId, authKey, starRtcLoginCallBack);
				}
			} else {
				$('#userId').html("登录失败");
			}
		});
	}
	else {
		loginSuccessViewSet();
		starRtcLogin(agentId, userId, "", starRtcLoginCallBack);
	}

}

function starRtcLoginCallBack(data, status) {
	switch (status) {
		//链接状态
		case "connect success":
		case "connect failed":
		case "connect closed":
			break;
		//收到登录消息
		case "onLoginMessage":
			console.log("login:" + data.status);
			break;
		//收到消息
		case "onSingleMessage":
			var fid = data.fromId;
			voipMsgWindow.displayMessage(data.fromId, data.msg.contentData, false);
			break;
		case "onGroupMessage":
			var gid = data.groupId;
			var fid = data.fromId;
			var msgJson = JSON.parse(data.msg);
			var msgTxt = msgJson.contentData;
			setGroupMessageInnerHTML(gid, fid + ":<br/>&nbsp;&nbsp;&nbsp;" + msgTxt);
			break;
		case "onGroupPrivateMessage":
			var gid = data.groupId;
			var fid = data.fromId;
			var msgJson = JSON.parse(data.msg);
			var msgTxt = msgJson.contentData;
			setGroupMessageInnerHTML(gid, fid + ":<br/>&nbsp;&nbsp;&nbsp;" + msgTxt);
			break;
		case "onGroupPushMessage":
			var gid = data.groupId;
			var msgJson = JSON.parse(data.msg);
			var msgTxt = msgJson.contentData;
			setGroupMessageInnerHTML(gid, msgTxt);
			break;
		case "onSystemPushMessage":
			var msgJson = JSON.parse(data.msg);
			var msgTxt = msgJson.contentData;
			setSingleMessageInnerHTML(status + ":" + msgTxt);
			setGroupMessageInnerHTML("all", status + ":" + msgTxt);
			break;
		case "onVoipMessage":
			switch (data.type) {
				case "voipCall":
					$("#callerId").html(data.fromId);
					voipResponseDlg.dialog("open");
					break;
				case "voipHangup":
					voipResponseDlg.dialog("close");
					break;
				case "voipRefuse":
					voipConnectDlg.dialog("close");
					$("#callerId").html("");
					alert("对方拒绝了通话！");
					break;
			}
			break;
		case "onErrorMessage":
			switch (data.errId) {
				case 2:
					alert("您的账号在另外的设备登录，您已经下线");
					$(".backButton")[0].click();
					starlogout();
					break;
			}
			break;
	}
};

function starRtcLogin(agentId, userId, authKey, callBack) {
	StarRtc.Instance.version();
	StarRtc.Instance.login(agentId, userId, authKey, callBack);
}
//////////////////////////////////////////////star box end////////////////////////////////////////
//////////////////////////////////////////////webrtc//////////////////////////////////////////////
function createWebrtcStream(callback) {
	rtc.createStream({
		"video": { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: { ideal: ["user"] } },
		"audio": { deviceId: { ideal: ["default"] } }
	}, callback);
}
//////////////////////////////////////////////webrtc end//////////////////////////////////////////
//////////////////////////////////////////////videoMeeting////////////////////////////////////////
var videoMeetingIds;
var selectVideoMeetingIndex;
var videoMeetingCreateDialog;
var videoMeetingDelDialog;
var oldBigVideo;
var nowBigVideo;

var currRoom = null;
//获取视频会议列表 

function enterVideoMeetingFunc() {
	currFunc.exit = exitVideoMeetingFunc;
	$("#videoMeetingList").html("");
	loadVideoMeetingList();
}

function loadVideoMeetingList(_callback) {
	$("#videoMeetingList").html("");
	if (StarRtc.Instance.configModePulic) {
		$.get(StarRtc.Instance.workServerUrl + "/meeting/list.php?appid=" + agentId, function (data, status) {
			if (status === "success") {
				var obj = JSON.parse(data);
				if (obj.status == 1) {
					videoMeetingIds = obj.data;
					for (var i = 0; i < videoMeetingIds.length; i++) {
						var item = videoMeetingIds[i];
						$("#videoMeetingList")[0].innerHTML +=
							"<div class='button2' onclick='openVideoMeeting(" + i + ")'>" + item.Name + "</div>";
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
		StarRtc.Instance.queryVideoMeetingRoom(function (status, listData) {
			videoMeetingIds = listData;
			for (var i = 0; i < listData.length; i++) {
				var item = listData[i];
				$("#videoMeetingList")[0].innerHTML +=
					"<div class='button2' onclick='openVideoMeeting(" + i + ")'>" + item.Name + "</div>";
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
		currRoom.leaveRoom();
		currRoom.sigDisconnect();
		currRoom = null;
	}

	selectVideoMeetingIndex = index;

	currRoom = StarRtc.Instance.getVideoMeetingRoomSDK("open", videoMeetingCallBack, { "roomInfo": videoMeetingIds[index] });
	currRoom.sigConnect();
}

function joinMeetingRoom(meetingInfo) {
	$('#videoMeetingTitle').html("");
	$('#videoMeetingTitle').html(meetingInfo.Name);

	if (meetingInfo.Creator == userId) {
		var delButton = $("<div style=\"width:25px;height:25px;position:absolute;left:10px;top:10px;background-image: url(images/exitMsgWindow.jpg);background-size: cover;cursor:pointer;z-index:1;\"></div>");
		delButton.bind("click", function () {
			videoMeetingDelDialog.dialog("open");
		});
		$('#videoMeetingTitle').append(delButton);
	}
}

function videoMeetingSetStream(object) {
	var selfVideo = $("#videoMeetingSelfVideo")[0];
	selfVideo.srcObject = object;
	selfVideo.play();
}

function videoMeetingCallBack(data, status, oper) {
	var thisRoom = data.obj;
	switch (status) {
		//链接状态
		case "connect success":
			switch (oper) {
				case "open":
					thisRoom.createStream();
					break;
				case "new":
					thisRoom.createNew();
					break;
			}
			break;
		case "connect failed":
		case "connect closed":
			stopVideoMeeting();
			break;
		case "onChatRoomMessage":
			switch (data.type) {
				case "joinChatRoom":
					if (data.status == "success") { }
					else {
						alert(data.failedStatus);
					}
					break;
				case "recvChatPrivateMsg":
					videoMeetingMsgWindow.displayMessage(data.msg.fromId + "私信", data.msg.contentData, false);
					break;
				case "recvChatMsg":
					videoMeetingMsgWindow.displayMessage(data.msg.fromId, data.msg.contentData, false);
					break;
				case "chatroomUserKicked":
					thisRoom.leaveRoom();
					alert("你已被踢出房间！");
					break;
				case "serverErr":
					alert("服务器错误：" + data.msg);
					break;
			}
			break;
		case "onWebrtcMessage":
			switch (data.type) {
				case "streamCreated":
					if (data.status == "success") {
						videoMeetingSetStream(data.streamObj);
						switch (oper) {
							case "open":
								thisRoom.joinRoom();
								break;
							case "new":
								thisRoom.joinRoom();
								break;
						}
					}
					else {
						alert("获取摄像头视频失败！请检查摄像头设备是否接入！");
					}
					break;
				case "srcApplyUpload":
					if (data.status == "success") {
						joinMeetingRoom(data.userData.roomInfo);
					}
					else {
						alert("上传申请失败");
						console.log("收到_webrtc_apply_failed");
					}
					break;
				case "addUploader":
					var newVideoId = "webrtc_video_" + data.upUserId;
					var streamInfo = data.streamInfo;
					streamInfo.videoId = newVideoId;
					videoMeetingAddNewVideo(newVideoId, streamInfo.streamObj, function (evt) {
						thisRoom.streamConfigChange(data.upId);
					});
					break;
				case "removeUploader":
					var streamInfo = data.streamInfo;
					var newVideoId = streamInfo.videoId;
					removeNewVideo($("#videoMeetingVideoZone"), $("#" + newVideoId));
					if (data.bigFlag) {
						var videos = $("#videoMeetingVideoZone").find("video[id!='videoMeetingSelfVideo']");
						if (videos.length > 0) {
							videos[videos.length - 1].click();
						}
					}
					break;
				case "delChannel":
					if (data.status == "success") {
						videoMeetingDelDialog.dialog("close");
						loadVideoMeetingList();
					}
					else {
						alert("删除视频会议失败");
					}
					break;
				case "createChannel":
					if (data.status == "success") {
						if (StarRtc.Instance.configModePulic) {
							$.get(StarRtc.Instance.workServerUrl + "/meeting/store?appid=" + agentId + "&ID=" + data.userData.roomInfo.ID + "&Name=" + data.userData.roomInfo.Name + "&Creator=" + data.userData.roomInfo.Creator);
						}
						else {
							StarRtc.Instance.reportRoom(CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_MEETING, data.userData.roomInfo, function (status) {
								console.log("创建" + status);
							});
						}
						videoMeetingCreateDialog.dialog("close");
						loadVideoMeetingList(function () {
							var index = -1;
							for (var i in videoMeetingIds) {
								if (videoMeetingIds[i].ID == data.userData.roomInfo.ID) {
									index = i;
								}
							}
							if (index >= 0) {
								selectVideoMeetingIndex = index;
							}
							else {
								selectVideoMeetingIndex = undefined;
							}
							thisRoom.createStream();
						});
					}
					else {
						alert("创建失败:" + data.msg);
					}
					break;
				case "serverErr":
					alert("服务器错误：" + data.msg);
					break;
			}
			break;
	}
}

function stopVideoMeeting() {
	videoMeetingCreateDialog.dialog("close");
	videoMeetingDelDialog.dialog("close");
	selectVideoMeetingIndex = undefined;
	$('#videoMeetingTitle').html("");
	$("#videoMeetingVideoZone").children().each(function (ids, ele) {
		var video = $(ele).children("video").first();
		if (video.attr("id") != "videoMeetingSelfVideo") {
			$(ele).remove();
		}
		else {
			video[0].srcObject = null;
			video[0].load();
		}
	});
}

function exitVideoMeetingFunc() {
	if (currRoom != null) {
		currRoom.leaveRoom();
		currRoom.sigDisconnect();
		currRoom = null;
	}
}

function videoMeetingAddNewVideo(newVideoId, stream, clickCallback) {
	var parentObj = $("#videoMeetingVideoZone");
	var wrapperObj = $("<div></div>");
	var videoObj = $("<video id=\"" + newVideoId + "\" style=\"width:100%;height:100%\" muted=\"true\"></video>");

	videoObj.bind("click", clickCallback);

	wrapperObj.append(videoObj);

	addNewVideo(parentObj, wrapperObj);

	videoObj[0].srcObject = stream;
	videoObj[0].play();
}

function vidoeMeetingCreateNewDlg() {
	$("#newMeetingName").val("网页会议_" + userId);
	videoMeetingCreateDialog.dialog("open");
}

function videoMeetingCreateNewMeeting() {
	var newMeetingName = $("#newMeetingName").val();
	if (newMeetingName == "") {
		alert("会议室名称不能为空！");
	}
	else {
		var type = $('#meetingTypecheck').is(':checked') ? 1 : 0;
		currRoom = StarRtc.Instance.getVideoMeetingRoomSDK("new", videoMeetingCallBack, {
			"roomInfo": {
				"Creator": userId,
				"ID": "",
				"Name": newMeetingName,
				"Type": type
			}
		}
		);
		currRoom.sigConnect();
	}
}

function videoMeetingDelMeeting() {
	{
		if (currRoom != null) {
			currRoom.deleteCurrRoom();
		}
	}
}

//////////////////////////////////////////////videoMeeting end////////////////////////////////
//////////////////////////////////////////////videoLive///////////////////////////////////////
var videoLiveIds;
var selectVideoLiveIndex;
var videoLiveCreateDialog;
var videoLiveDelDialog;
var videoLiveManageDialog;
var videoLiveMyCanvas = null;
var videoLiveCanvasDlg;
//获取视频会议列表 

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

//获取视频会议列表 
function loadVideoLiveList(_callback) {
	$("#videoLiveList").html("");
	if (StarRtc.Instance.configModePulic) {
		$.get(StarRtc.Instance.workServerUrl + "/live/list.php?appid=" + agentId, function (data, status) {
			if (status === "success") {
				var obj = JSON.parse(data);
				if (obj.status == 1) {
					videoLiveIds = obj.data;
					for (var i = 0; i < videoLiveIds.length; i++) {
						var item = videoLiveIds[i];
						$("#videoLiveList")[0].innerHTML +=
							"<div class='button2' onclick='openVideoLive(" + i + ")'>" + item.Name + "</div>";
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
		StarRtc.Instance.queryVideoLiveRoom(function (status, listData) {
			videoLiveIds = listData;
			for (var i = 0; i < listData.length; i++) {
				var item = listData[i];
				$("#videoLiveList")[0].innerHTML +=
					"<div class='button2' onclick='openVideoLive(" + i + ")'>" + item.Name + "</div>";
			}
			if (_callback != undefined) {
				_callback();
			}
		})
	}
}

function joinLiveRoom(liveInfo) {
	$('#videoLiveTitle').html("");
	$('#videoLiveTitle').html(liveInfo.Name);

	if (liveInfo.Creator == userId) {
		var delButton = $("<div style=\"width:25px;height:25px;position:absolute;left:10px;top:10px;background-image: url(images/exitMsgWindow.jpg);background-size: cover;cursor:pointer;z-index:1;\"></div>");
		delButton.bind("click", function () {
			videoLiveDelDialog.dialog("open");
		});
		$('#videoLiveTitle').append(delButton);
	}
}

function videoLiveSetStream(object) {
	$("#videoLiveSelfVideo").parent().show();
	var selfVideo = $("#videoLiveSelfVideo")[0];
	selfVideo.srcObject = object;
	selfVideo.play();
}

function videoLiveSrcCallBack(data, status, oper) {
	var thisRoom = data.obj;
	switch (status) {
		//链接状态
		case "connect success":
			switch (oper) {
				case "open":
					thisRoom.createStream();
					break;
				case "new":
					thisRoom.createNew();
					break;
			}
			break;
		case "connect failed":
		case "connect closed":
			stopVideoLive();
			break;
		case "onWebrtcMessage":
			{
				switch (data.type) {
					case "streamCreated":
						if (data.status == "success") {
							videoLiveSetStream(data.streamObj);
							switch (oper) {
								case "open":
									thisRoom.joinRoom();
									break;
								case "new":
									thisRoom.joinRoom();
									break;
							}
						}
						else {
							alert("获取摄像头视频失败！请检查摄像头设备是否接入！");
						}
						break;
					case "srcApplyUpload":
						if (data.status == "success") {
							if (oper == "new") {
								videoLiveMyCanvas = new MyCanvas("videoLiveMyCanvas", true, canvasDrawCallback);
							}
							$("#vidoeLiveApplyButton").hide();
							$("#vidoeCanvasButton").show();
							joinLiveRoom(data.userData.roomInfo);
						}
						else {
							alert("上传视频申请失败！");
							console.log("收到_webrtc_apply_failed");
						}
						break;
					case "addUploader":
						var newVideoId = "webrtc_video_" + data.upUserId;
						var streamInfo = data.streamInfo;
						streamInfo.videoId = newVideoId;
						videoLiveAddNewVideo(newVideoId, streamInfo.streamObj, function (evt) {
							thisRoom.streamConfigChange(data.upId);
						});
						break;
					case "removeUploader":
						var streamInfo = data.streamInfo;
						var newVideoId = streamInfo.videoId;
						removeNewVideo($("#videoLiveVideoZone"), $("#" + newVideoId));
						if (data.bigFlag) {
							var videos = $("#videoLiveVideoZone").find("video[id!='videoLiveSelfVideo']");
							if (videos.length > 0) {
								videos[videos.length - 1].click();
							}
						}
						break;
					case "delChannel":
						if (data.status == "success") {
							videoLiveDelDialog.dialog("close");
							loadVideoLiveList();
						}
						else {
							alert("删除视频会议失败");
						}
						break;
					case "createChannel":
						if (data.status == "success") {
							if (StarRtc.Instance.configModePulic) {
								$.get(StarRtc.Instance.workServerUrl + "/live/store?appid=" + agentId + "&ID=" + data.userData.roomInfo.ID + "&Name=" + data.userData.roomInfo.Name + "&Creator=" + data.userData.roomInfo.Creator);
							}
							else {
								StarRtc.Instance.reportRoom(CHATROOM_LIST_TYPE.CHATROOM_LIST_TYPE_LIVE, data.userData.roomInfo, function (status) {
									console.log("创建" + status);
								});
							}
							videoLiveCreateDialog.dialog("close");
							loadVideoLiveList(function () {
								var index = -1;
								for (var i in videoLiveIds) {
									if (videoLiveIds[i].ID == data.userData.roomInfo.ID) {
										index = i;
									}
								}
								if (index >= 0) {
									selectVideoLiveIndex = index;
								}
								else {
									selectVideoLiveIndex = undefined;
								}
								thisRoom.createStream();
							});
						}
						else {
							alert("创建失败:" + data.msg);
						}
						break;
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
					case "serverErr":
						alert("服务器错误：" + data.msg);
						break;
				}
			}
			break;
		case "onChatRoomMessage":
			{
				switch (data.type) {
					case "recvChatPrivateMsg":
						if (data.msg.msgType == "linkStop") {
							openVideoLive(selectVideoLiveIndex);
						}
						else if (data.msg.msgType == "apply") {
							videoLiveManageDialog.userData = { "fromUserId": data.fromUserId };
							$("#applyTargetId").html(data.msg.fromId);
							videoLiveManageDialog.dialog("open");
						}
						else if (data.msg.msgType == "inviteAgree") {

						}
						else if (data.msg.msgType == "inviteDisagree") {
							alert(data.msg.fromId + "拒绝了您的连麦邀请！")
						}
						else {
							videoLiveMsgWindow.displayMessage(data.msg.fromId + "私信", data.msg.contentData, false);
						}
						break;
					case "recvChatMsg":
						videoLiveMsgWindow.displayMessage(data.msg.fromId, data.msg.contentData, false);
						break;
					case "chatroomUserKicked":
						thisRoom.leaveRoom();
						alert("你已被踢出房间！");
						break;
					case "deleteChatRoom":
						if (data.status == "success") {
							videoLiveDelDialog.dialog("close");
							loadVideoLiveList();
						}
						else {
							alert("删除聊天室失败");
						}
						break;
					case "serverErr":
						alert("服务器错误：" + data.msg);
						break;
				}
			}
			break;
	}
}

function videoLiveVdnCallBack(data, status, oper) {
	var thisRoom = data.obj;
	switch (status) {
		//链接状态
		case "connect success":
			switch (oper) {
				case "open":
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
		case "onWebrtcMessage":
			switch (data.type) {
				case "streamCreated":
					if (data.status == "success") {
						thisRoom.joinRoom();
					}
					else {
						alert("获取摄像头视频失败！请检查摄像头设备是否接入！");
					}
					break;
				case "vdnApplyDownload":
					if (data.status == "success") {
						joinLiveRoom(data.userData.roomInfo);
						$("#vidoeLiveApplyButton").show();
					}
					else {
						alert("获取数据失败");
						console.log("收到vdnApplyDownload_failed");
						thisRoom.leaveRoom();
					}
					break;
				case "addUploader":
					var newVideoId = "webrtc_video_" + data.upUserId;
					var streamInfo = data.streamInfo;
					streamInfo.videoId = newVideoId;
					videoLiveAddNewVideo(newVideoId, streamInfo.streamObj, function (evt) {
						thisRoom.streamConfigChange(data.upId);
					});
					break;
				case "removeUploader":
					var streamInfo = data.streamInfo;
					var newVideoId = streamInfo.videoId;
					removeNewVideo($("#videoMeetingVideoZone"), $("#" + newVideoId));
					if (data.bigFlag) {
						var videos = $("#videoLiveVideoZone").find("video[id!='videoLiveSelfVideo']");
						if (videos.length > 0) {
							videos[videos.length - 1].click();
						}
					}
					break;
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
				case "serverErr":
					alert("服务器错误：" + data.msg);
					break;
			}
			break;
		case "onChatRoomMessage":
			{
				switch (data.type) {
					case "recvChatPrivateMsg":
						if (data.msg.msgType == "applyAgree" || data.msg.msgType == "inviteStart") {
							openVideoLive(selectVideoLiveIndex, "applyAgree");
						}
						else if (data.msg.msgType == "linkStop") {
							openVideoLive(selectVideoLiveIndex);
						}
						else if (data.msg.msgType == "applyDisagree") {
							alert("房主拒绝了连麦申请");
						}
						else if (data.msg.msgType == "invite") {

						}
						else {
							videoLiveMsgWindow.displayMessage(data.msg.fromId + "私信", data.msg.contentData, false);
						}
						break;
					case "recvChatMsg":
						videoLiveMsgWindow.displayMessage(data.msg.fromId, data.msg.contentData, false);
						break;
					case "chatroomUserKicked":
						thisRoom.leaveRoom();
						alert("你已被踢出房间！");
						break;
					case "serverErr":
						alert("服务器错误：" + data.msg);
						break;
				}
			}
			break;
	}
}

function stopVideoLive() {
	if (videoLiveMyCanvas != undefined) {
		videoLiveMyCanvas.clearAll();
	}
	$("#vidoeLiveApplyButton").hide();
	$("#vidoeCanvasButton").hide();
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
			video[0].load();
		}
	});
}

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

//进入视频会议

function openVideoLive(index, from) {

	var tmpFrom = from || "";

	if (selectVideoLiveIndex == index && tmpFrom != "applyAgree") return;
	if (currRoom != null) {
		currRoom.leaveRoom();
		currRoom.sigDisconnect();
		currRoom = null;
	}

	selectVideoLiveIndex = index;

	if (videoLiveIds[index].Creator == userId || tmpFrom == "applyAgree") {
		videoLiveMyCanvas = new MyCanvas("videoLiveMyCanvas", true, canvasDrawCallback);
		var a = $("#videoLiveSelfVideo");
		if ($("#videoLiveSelfVideo").length == 0) {
			videoLiveAddNewVideo("videoLiveSelfVideo", null, null);
			$("#videoLiveSelfVideo").attr("muted", "true");
		}
		currRoom = StarRtc.Instance.getVideoLiveRoomSDK("src", "open", videoLiveSrcCallBack, { "roomInfo": videoLiveIds[index] });
	}
	else {
		videoLiveMyCanvas = new MyCanvas("videoLiveMyCanvas", true, canvasDrawCallback);
		if ($("#videoLiveSelfVideo").length > 0) {
			removeNewVideo($("#videoMeetingVideoZone"), $("#videoLiveSelfVideo"));
		}
		currRoom = StarRtc.Instance.getVideoLiveRoomSDK("vdn", "open", videoLiveVdnCallBack, { "roomInfo": videoLiveIds[index] });
	}

	currRoom.sigConnect();
}

function videoLiveCanvasShow() {
	if (videoLiveMyCanvas != null) {
		videoLiveCanvasDlg.dialog("open");
	}
}

function videoLiveCleanCanvas() {
	if (videoLiveMyCanvas != null && currRoom != null) {
		videoLiveMyCanvas.clearAll();
		currRoom.sendStreamData("CLEAN");
	}
}

function canvasDrawCallback(points) {
	if (currRoom) {
		var data = points.join("/");
		currRoom.sendStreamData(data);
	}
}

function vidoeLiveCreateNewDlg() {
	$("#newLiveName").val("网页直播_" + userId);
	videoLiveCreateDialog.dialog("open");
}

function videoLiveCreateNewLive() {
	var newLiveName = $("#newLiveName").val();
	if (newLiveName == "") {
		alert("直播名称不能为空！");
	}
	else {
		var type = $('#liveTypecheck').is(':checked') ? 1 : 0;
		if ($("#videoLiveSelfVideo").length == 0) {
			videoLiveAddNewVideo("videoLiveSelfVideo", null, null);
			$("#videoLiveSelfVideo").attr("muted", "true");
		}
		currRoom = StarRtc.Instance.getVideoLiveRoomSDK("src", "new", videoLiveSrcCallBack, {
			"roomInfo": {
				"Creator": userId,
				"ID": "",
				"Name": newLiveName,
				"Type": type
			}
		}
		);
		currRoom.sigConnect();
	}
}

function videoLiveDelLive() {
	//if(selectVideoLiveIndex != undefined)
	{
		if (currRoom != null) {
			currRoom.deleteCurrRoom();
		}
	}
}

function videoLiveInputMsgCallBack(msg) {
	if (currRoom != null) {
		currRoom.sendChatMsg(msg);
	}
}

function vidoeLiveVdnApply() {
	if (currRoom != null) {
		currRoom.sendApplyMsg();
	}
	videoLiveApplyDialog.dialog("close");
}

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

function videoLiveApplyAgree() {
	if (currRoom != null) {
		var userId = $("#applyTargetId").html();
		currRoom.sendApplyAgreeMsg(userId);
	}
	videoLiveManageDialog.dialog("close");
}

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

function enterVoipFunc() {
	currFunc.exit = exitVoipFunc;
}

function exitVoipFunc() {
	if (currRoom != null) {
		currRoom.leaveRoom();
		currRoom.sigDisconnect();
		currRoom = null;
	}
}

function callingVOIP() {
	var targetUid = $('#targetUserId').val();

	if (targetUid == null || targetUid == undefined || targetUid == "") {
		alert("对方ID不能为空");
		return;
	}

	currRoom = StarRtc.Instance.getVoipRoomSDK("call", voipCallBack, { "roomInfo": { "targetId": targetUid } });
	currRoom.sigConnect();
	voipConnectDlg.dialog("open");
}

function hangupVOIP() {
	exitVoipFunc();
}

function voipCallBack(data, status, oper) {
	var thisRoom = data.obj;
	switch (status) {
		//链接状态
		case "connect success":
			thisRoom.createStream();
			break;
		case "connect failed":
		case "connect closed":
			stopVoip();
			break;
		case "onWebrtcMessage":
			switch (data.type) {
				case "streamCreated":
					if (data.status == "success") {
						voipSetStream($("#voipSmallVideo")[0], data.streamObj);
						thisRoom.joinRoom();
					}
					else {
						voipConnectDlg.dialog("close");
						alert("获取摄像头视频失败！请检查摄像头设备是否接入！");
					}
					break;
				case "voipCalling":
					if (data.status == "success") {

					}
					break;
				case "voipResponseing":
					if (data.status == "success") {
						$('#targetUserId').val(data.userData.roomInfo.targetId);
					}
					break;
				case "voipStreamReady":
					voipSetStream($("#voipBigVideo")[0], data.streamObj);
					break;
			}
			break;
		case "onVoipMessage":
			switch (data.type) {
				case "voipRefuse":
					voipConnectDlg.dialog("close");
					$("#callerId").html("");
					alert("对方拒绝了通话！");
					thisRoom.sigDisconnect();
					break;
				case "voipHangup":
					alert("对方挂断了通话！");
					thisRoom.sigDisconnect();
					break;
				case "voipConnect":
					voipConnectDlg.dialog("close");
					break;
				case "voipBusy":
					alert("对方正忙！");
					thisRoom.sigDisconnect();
					break;
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

function voipAcceptCall() {
	if (currFunc.exit != undefined) {
		currFunc.exit();
	}
	showVoipTab();

	var targetId = $("#callerId").html();
	currRoom = StarRtc.Instance.getVoipRoomSDK("response", voipCallBack, { "roomInfo": { "targetId": targetId } });
	currRoom.sigConnect();
	voipResponseDlg.dialog("close");
}

function voipRefuseCall() {
	var targetId = $("#callerId").html();
	StarRtc.Instance.sendVoipRefuseMsg(targetId);
	voipResponseDlg.dialog("close");
}

function voipCancleCall() {
	hangupVOIP();
	voipConnectDlg.dialog("close");
}

function stopVoip() {
	currRoom = null;
	voipResponseDlg.dialog("close");
	$("#callerId").html("");
	$('#targetUserId').val("");
	$("#voipBigVideo")[0].srcObject = null;
	$("#voipBigVideo")[0].load();
	$("#voipSmallVideo")[0].srcObject = null;
	$("#voipSmallVideo")[0].load();
}

function voipInputMsgCallBack(msg) {
	if (currRoom != null) {
		currRoom.sendVoipMsg(msg);
	}
}

//////////////////////////////////////////////void end////////////////////////////////////////
//////////////////////////////////////////////iot car start////////////////////////////////////////
var Demo = window.NameSpace || {};
Demo.IotCarSDK = function () {
	var self = this;
	var roomSDK = null;
	var starImInterface = StarRtc.Instance;
	var car0Id = "xh_iot_car_0";
	var userData = { "roomInfo": {} };

	starImInterface.setIMExtraback(function (_data, status) {
		iotInnerCallback(_data, "onIotMessage");
	});

	var iotInnerCallback = function (data, status) {
		data.userData = userData;
		data.obj = self;
		switch (status) {
			case "onIotMessage":
				{
					if (data.msg.fromId == car0Id) {
						userData.roomInfo.ID = data.msg.contentData;
						userData.roomInfo.Creator = car0Id;
						roomSDK = StarRtc.Instance.getVideoLiveRoomSDK("vdn", "open", iotCarVdnCallBack, userData);
						roomSDK.sigConnect();
					}
				}
				break;
			default:
				break;
		}
	}

	function iotCarVdnCallBack(data, status, oper) {
		data.obj = self;
		switch (status) {
			//链接状态
			case "connect success":
				roomSDK.createStream();
				break;
			case "connect failed":
			case "connect closed":
				//stopVideoLive();
				break;
			case "onWebrtcMessage":
				switch (data.type) {
					case "streamCreated":
						if (data.status == "success") {
							roomSDK.joinRoom();
						}
						else {

						}
						break;
					case "vdnApplyDownload":
						if (data.status == "success") {
							roomSDK.sendApplyMsg();
							//joinLiveRoom(data.userData.roomInfo);
							//$("#vidoeLiveApplyButton").show();
						}
						else {
							console.log("收到vdnApplyDownload_failed");
							roomSDK.leaveRoom();
						}
						break;
					/* case "addUploader":
						var newVideoId = "webrtc_video_" + data.upUserId;
						var streamInfo = data.streamInfo;
						streamInfo.videoId = newVideoId;
						videoLiveAddNewVideo(newVideoId, streamInfo.streamObj, function(evt){
							thisRoom.streamConfigChange(data.upId);
						});
						break;
					case "removeUploader":
						var streamInfo = data.streamInfo;
						var newVideoId = streamInfo.videoId;
						removeNewVideo($("#videoMeetingVideoZone"), $("#" + newVideoId));
						if(data.bigFlag)
						{
							var videos = $("#videoLiveVideoZone").find("video[id!='videoLiveSelfVideo']");
							if(videos.length > 0)
							{
								videos[videos.length - 1].click();
							}
						}
						break;
					case "streamData":
						videoLiveCanvasDlg.dialog("open");
						if(data.streamData != "CLEAN")
						{
							var points = data.streamData.split("/");
							for(var i in points)
							{
								var point = points[i].split(",");
								videoLiveMyCanvas.addPoint(data.upId, parseInt(point[0]), parseInt(point[1]));
							}
							videoLiveMyCanvas.redraw();
						}
						else
						{
							videoLiveMyCanvas.clearAll();
						}
						break; */
				}
				break;
			case "onChatRoomMessage":
				{
					switch (data.type) {
						case "recvChatPrivateMsg":
							if (data.msg.msgType == "applyAgree" || data.msg.msgType == "inviteStart") {
								roomSDK.leaveRoom();
								roomSDK.sigDisconnect();
								roomSDK = null;
								roomSDK = StarRtc.Instance.getVideoLiveRoomSDK("src", "open", iotCarSrcCallBack, userData);
								roomSDK.sigConnect();
								//openVideoLive(selectVideoLiveIndex, "applyAgree");
							}
							else if (data.msg.msgType == "linkStop") {
								//openVideoLive(selectVideoLiveIndex);
							}
							else if (data.msg.msgType == "applyDisagree") {
								alert("房主拒绝了连麦申请");
							}
							else if (data.msg.msgType == "invite") {

							}
							else {
								//videoLiveMsgWindow.displayMessage(data.msg.fromId + "私信", data.msg.contentData, false);
							}
							break;
						case "recvChatMsg":
							//videoLiveMsgWindow.displayMessage(data.msg.fromId, data.msg.contentData, false);
							break;
						case "chatroomUserKicked":
							roomSDK.leaveRoom();
							alert("你已被踢出房间！");
							break;
					}
				}
				break;
		}
	}

	function iotCarSrcCallBack(data, status, oper) {
		data.obj = self;
		switch (status) {
			//链接状态
			case "connect success":
				alert("启动小车成功！");
				roomSDK.createStream();
				break;
			case "connect failed":
			case "connect closed":
				//stopVideoLive();
				break;
			case "onWebrtcMessage":
				{
					switch (data.type) {
						case "streamCreated":
							if (data.status == "success") {
								//videoLiveSetStream(data.streamObj);
								switch (oper) {
									case "open":
										roomSDK.joinRoom();
										break;
								}
							}
							else {

							}
							break;
						case "srcApplyUpload":
							if (data.status == "success") {
								//$("#vidoeLiveApplyButton").hide();
								//joinLiveRoom(data.userData.roomInfo);
							}
							else {
								console.log("收到_webrtc_apply_failed");
							}
							break;
						case "addUploader":
							var newVideoId = "webrtc_video_" + data.upUserId;
							var streamInfo = data.streamInfo;
							streamInfo.videoId = newVideoId;
							roomSDK.streamConfigChange(data.upId);
							iotCarAddNewVideo(newVideoId, streamInfo.streamObj, function (evt) {
								roomSDK.streamConfigChange(data.upId);
							});
							break;
						case "removeUploader":
							var streamInfo = data.streamInfo;
							var newVideoId = streamInfo.videoId;
							removeNewVideo($("#iotCarVideoZone"), $("#" + newVideoId));
							if (data.bigFlag) {
								var videos = $("#iotCarVideoZone").find("video[id!='videoLiveSelfVideo']");
								if (videos.length > 0) {
									videos[videos.length - 1].click();
								}
							}
							break;
					}
				}
				break;
			case "onChatRoomMessage":
				{
					switch (data.type) {
						case "recvChatPrivateMsg":
							if (data.msg.msgType == "linkStop") {
								//openVideoLive(selectVideoLiveIndex);
							}
							else if (data.msg.msgType == "apply") {
								//videoLiveManageDialog.userData = {"fromUserId":data.fromUserId};
								//$("#applyTargetId").html(data.msg.fromId);
								//videoLiveManageDialog.dialog("open");
							}
							else if (data.msg.msgType == "inviteAgree") {

							}
							else if (data.msg.msgType == "inviteDisagree") {
								alert(data.msg.fromId + "拒绝了您的连麦邀请！")
							}
							else {
								//videoLiveMsgWindow.displayMessage(data.msg.fromId + "私信", data.msg.contentData, false);
							}
							break;
						case "recvChatMsg":
							//videoLiveMsgWindow.displayMessage(data.msg.fromId, data.msg.contentData, false);
							break;
						case "chatroomUserKicked":
							roomSDK.leaveRoom();
							alert("你已被踢出房间！");
							break;
					}
				}
				break;
		}
	}

	self.startIotCar = function () {
		starImInterface.sendSingleMsg(car0Id, "新消息", "IotCarStart", MSG_DATA_TYPE.MSG_DATA_TYPE_CONTROL);
	}


	self.stopIotCar = function () {
		starImInterface.setIMExtraback(null);
		if (roomSDK != null) {
			roomSDK.leaveRoom();
			roomSDK.sigDisconnect();
			roomSDK = null;
		}
	}

	self.iotCarCtrl = function (type) {
		if (roomSDK != null) {
			roomSDK.sendStreamData(type);
		}
	}

	return self;
}

function iotCarAddNewVideo(newVideoId, stream, clickCallback) {

	var parentObj = $("#iotCarVideoZone");
	var wrapperObj = $("<div></div>");
	var videoObj = $("<video id=\"" + newVideoId + "\" style=\"width:100%;height:100%\"></video>");

	videoObj.bind("click", clickCallback);

	wrapperObj.append(videoObj);

	addNewVideo(parentObj, wrapperObj);

	videoObj[0].srcObject = stream;
	videoObj[0].play();
}

function enterIotCarFunc() {
	currFunc.exit = exitIotCarFunc;
}

function exitIotCarFunc() {
	if (currRoom != null) {
		currRoom.stopIotCar();
		currRoom = null;
	}
}

function startIotCar() {
	if (currRoom != null) {
		currRoom.stopIotCar();
		currRoom = null;
	}

	currRoom = new Demo.IotCarSDK();

	currRoom.startIotCar();
}

function iotCarCtrl(type) {
	if (currRoom != null) {
		currRoom.iotCarCtrl("start");
		currRoom.iotCarCtrl(type);
		$(window).bind("mouseup", function () {
			currRoom.iotCarCtrl("stop");
			$(window).unbind("mouseup");
		});
	}
}

var lastData = "camera==";

function iotCarDragStop(event, ui) {
	lastData = "camera==";
	if (currRoom) {
		currRoom.iotCarCtrl(lastData);
	}
}

function iotCarDrag(event, ui) {

	// Keep the left edge of the element
	// at least 100 pixels from the container
	/* ui.position.left = Math.min( 50, ui.position.left );
ui.position.top = Math.min( 50, ui.position.top );
ui.position.left = Math.max( -50, ui.position.left );
ui.position.top = Math.max( -50, ui.position.top ); */
	var data = lastData;
	if (ui.position.left >= 16) {
		if (ui.position.top >= 16) {
			data = "camera-+";
		}
		else if (ui.position.top <= -17) {
			data = "camera--";
		}
		else {
			data = "camera-=";
		}
	}
	else if (ui.position.left <= -17) {
		if (ui.position.top >= 16) {
			data = "camera++";
		}
		else if (ui.position.top <= -17) {
			data = "camera+-";
		}
		else {
			data = "camera+=";
		}
	}
	else {
		if (ui.position.top >= 16) {
			data = "camera=+";
		}
		else if (ui.position.top <= -17) {
			data = "camera=-";
		}
		else {
			data = "camera==";
		}
	}

	if (lastData != data) {
		lastData = data;
		//console.log(data);
		if (currRoom) {
			currRoom.iotCarCtrl(data);
		}
	}
}

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

//////////////////////////////////////////////iot car end////////////////////////////////////////

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

	$("#iotCarZone").height(fullHeight - backButtonHeight);

	videoMeetingMsgWindow = new MyMsgWindow("videoMeetingMsgWindow", videoLiveInputMsgCallBack);
	voipMsgWindow = new MyMsgWindow("voipMsgWindow", voipInputMsgCallBack);
	videoLiveMsgWindow = new MyMsgWindow("videoLiveMsgWindow", videoLiveInputMsgCallBack);

	$("#iotCarMsgWindow").hide();
	$("#videoLiveMsgWindow").hide();
	$("#videoMeetingMsgWindow").hide();
	$("#voipMsgWindow").hide();
	$("#vidoeLiveApplyButton").hide();
	$("#vidoeCanvasButton").hide();
	$("#iotCarButton").hide();

	$("#videoLiveSelfVideo").parent().hide();

	$("#iotCarDrag").draggable({
		drag: iotCarDrag,
		revert: true,
		containment: "#iotCarDragZone",
		stop: iotCarDragStop
	});


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

	videoLiveApplyDialog = $("#videoLiveApplyDlg").dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"确定": vidoeLiveVdnApply,
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



	$("#liveTypecheck").button();
	$("#meetingTypecheck").button();

	var localId = getCookie("starrtc_userId");
	var localAuthKey = getCookie("starrtc_authKey");
	if (localId != "" && localAuthKey != "") {
		userId = localId;
		authKey = localAuthKey;
		loginSuccessViewSet();

		starRtcLogin(agentId, userId, authKey, starRtcLoginCallBack);
	}
	else {
		switchLogin(true);
	}

	bindEvent();

});
