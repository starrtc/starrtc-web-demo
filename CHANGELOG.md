v1.1.8 2020/1/6
==
# 注：1.1.8版本的web SDK 只兼容最新的2.9.4版本及以后的服务端程序，不兼容以前更低版本
1. SDK BUG 修复
---
- 1.1 修复删除群成员时，会报错的问题
- 1.2 修复voip呼叫时，对方选择拒绝后，对方发起voip呼叫，收不到呼叫请求的问题
- 1.3 修复给数组扩展自定义属性时，因为 for in 循环产生的问题
---
2. SDK功能更新
---
- 2.1 StarRtc.StarSDK.setGroupMsgPush 增加返回值标识，批量创建时用以识别对应
- 2.2 StarRtc.StarSDK.removeGroupUsers 增加返回值标识，批量创建时用以识别对应
- 2.3 StarRtc.StarSDK.addGroupUsers 增加返回值标识，批量创建时用以识别对应
- 2.4 StarRtc.StarSDK.delGroup 增加返回值标识，批量创建时用以识别对应
- 2.5 StarRtc.StarSDK.createGroup 增加返回值标识，批量创建时用以识别对应
- 2.6 StarRtc.StarSDK.getGroupList 增加返回值标识，批量创建时用以识别对应
- 2.7 StarRtc.StarSDK.getGroupUserList 增加返回值标识，批量创建时用以识别对应
---
3. demo更新
---
- 3.1 更新超级对讲，有人开启说话时，判断是不是自己，防止听到自己的声音
---
4. 已知问题
---
- 4.1 多浏览器支持在微信浏览器，safari，opera，firefox进行视频互通时，会出现没有画面的情况
- 4.2 直播观看者（vdn），切换到大图时，会出现花屏情况
- 4.3 由web发起的超清（1080p）视频，在其他端上看会模糊
---
v1.1.7 2019/11/8
==
# 注：1.1.7版本的web SDK 只兼容最新的2.9.4版本及以后的服务端程序，不兼容以前更低版本
1. demo更新
---
- 1.1 在src的回调srcApplyUpload中，增加了data.recSessionId属性，该属性为服务端录制src视频保存的子目录名
---
2. 已知问题
---
- 2.1 多浏览器支持在微信浏览器，safari，opera，firefox进行视频互通时，会出现没有画面的情况
---
v1.1.6 2019/10/30
==
# 注：1.1.6版本的web SDK 只兼容最新的2.9.3版本及以后的服务端程序，不兼容以前更低版本
1. SDK BUG 修复
---
- 1.1 修复重复进入会议室、直播画面会延迟显示的情况
- 1.2 修复web端会出现听不到对端声音的情况
---
2. demo更新
---
- 2.1 在voip的回调函数voipCalling和voipResponseing中，增加了data.recSessionId属性，该属性为服务端录制voip视频保存的子目录名
---
3. 已知问题
---
- 3.1 多浏览器支持在微信浏览器，safari，opera，firefox进行视频互通时，会出现没有画面的情况
---
v1.1.5 2019/09/29
==
1. SDK BUG 修复
---
- 1.1 超级对讲可能存在的调用startTalk接口后，无法正常开启讲话的BUG
- 1.2 加入房间时，由于时机导致的回调异常，无法收到已在房间内的人的addUploader回调消息的BUG
---
2. demo更新
---
- 2.1 更新收到removeUploader时，重新设置流配置的例子
- 2.2 更新了一些备注
---
3. 已知问题
---
- 3.1 多浏览器支持在微信浏览器，safari，opera，firefox进行视频互通时，会出现没有画面的情况
- 3.2 web端会出现听不到对端声音的情况
- 3.3 重复进入会议室画面会延迟显示的情况
---
v1.1.4 2019/08/13
==
1. SDK功能更新
---
- 1.1 SDK支持关闭视频和关闭音频（同时影响远端）
---
2. demo更新
---
- 2.1 web demo 视频会议增加支持关闭视频和关闭音频示例
---
3. 新增接口
---
- 3.1 接口StarRtc.StarRoomSDK.publishStream设置流可见性（会同时影响自己本地流和对端流）
- 3.2 接口StarRtc.StarVideoRoomSDK.publishStream设置流可见性（会同时影响自己本地流和对端流）
- 3.3 接口StarRtc.StarVideoSDK.publishStream设置流可见性（会同时影响自己本地流和对端流）
---
4. 已知问题
---
- 4.1 多浏览器支持在微信浏览器，safari，opera，firefox进行视频互通时，会出现没有画面的情况
- 4.2 web端会出现听不到对端声音的情况
- 4.3 重复进入会议室画面会延迟显示的情况
---
v1.1.3 2019/08/07
==
1. SDK功能更新
---
- 1.1 SDK支持firefox
- 1.2 SDK在不使用摄像头时，释放对摄像头的占用
- 1.3 SDK增加log输出分级
---
2. demo更新
---
- 2.1 web demo 增加log输出分级
---
3. 新增接口
---
- 3.1 接口StarRtc.InitlogLevel设置日志等级，开启低等级日志会包含高等级日志，如开启DEBUG，则同时开启INFO、WARN、ERROR，默认为开启DEBUG
---
4. 已知问题
---
- 4.1 多浏览器支持在微信浏览器，safari，opera，firefox进行视频互通时，会出现没有画面的情况
- 4.2 web端会出现听不到对端声音的情况
- 4.3 重复进入会议室画面会延迟显示的情况
---
v1.1.2 2019/07/23
==
1. SDK功能更新
---
- 1.1 SDK支持多浏览器，包括chrome（版本不限），360，腾讯，搜狗，微信浏览器，safari，opera，暂不支持firefox
- 1.2 修改了切换视频流大小图接口，目前可以自由配置流大图小图，之前版本只支持同时显示一个大图
---
2. demo更新
---
- 2.1 web demo 支持多浏览器
- 2.2 web demo 更改切换大小图代码（搜索 streamInfos 变量相关方法）
---
3. 新增接口
---
- 3.1 接口StarRtc.StarRoomSDK.streamConfigApply（新的切换大小图方法）
- 3.2 接口StarRtc.StarVideoRoomSDK.streamConfigApply（新的切换大小图方法）
- 3.3 接口StarRtc.StarVideoSDK.streamConfigApply（新的切换大小图方法）
---
4. 接口变更
---
- 4.1 接口StarRtc.StarSDK.setSrcServerInfo= function (srcServerUrl, srcServerWebsocketPort, srcServerWebrtcPort, srcServerWebrtcIP)，新加参数srcServerWebrtcIP，此参数为可选参数，不传入时与serverUrl相同，用于chrome72版本以下、firefox、safari使用
- 4.2 接口StarRtc.StarSDK.setVdnServerInfo = function (vdnServerUrl, vdnServerWebsocketPort, vdnServerWebrtcPort, vdnServerWebrtcIP)，新加参数vdnServerWebrtcIP，此参数为可选参数，不传入时与serverUrl相同，用于chrome72版本以下、firefox、safari使用
- 4.3 接口StarRtc.StarSDK.setVoipServerInfo = function (voipServerUrl, voipServerPort, voipServerWebsocketPort, voipServerWebrtcPort, voipServerWebrtcIP)，新加参数voipServerWebrtcIP，此参数为可选参数，不传入时与serverUrl相同，用于chrome72版本以下、firefox、safari使用
---
5. 接口废弃
---
- 5.1 接口StarRtc.StarRoomSDK.streamConfigChange（旧的切换大小图方法）
- 5.2 接口StarRtc.StarVideoRoomSDK.streamConfigChange（旧的切换大小图方法）
- 5.3 接口StarRtc.StarVideoSDK.streamConfigChange（旧的切换大小图方法）
---
6. bug修复
---
- 6.1 demo修复创建房间失败时，再次创建房间会报chatroom重复登录的错误
---
7. 已知问题
---
- 7.1 多浏览器支持在微信浏览器，safari，opera进行视频互通时，会出现没有画面的情况
---
v1.1.1 2019/07/10
==
1. SDK功能更新
---
- 1.1 SDK支持voip音频对话模式
---
2. demo更新
---
- 2.1 web demo voip可选择音、视频对话示例
- 2.2 im demo提供聊天室创建，群组创建，群组成员查看、添加示例
---
3. 接口变更
---
- 3.1 接口StarRtc.StarSDK.getVoipRoomSDK = function (_oper, _userCallback, _userData)，参数_userData结构变为{"roomInfo":{"targetId":对方id, "audioOnly":是否仅进行音频聊天（可不传入，默认值为false，视频聊天）}}
- 3.2 接口StarRtc.StarSDK.sendVoipCallMsg = function (_targetId, _ts, _flag) 新加可选参数_flag， 是否是音频呼叫，默认为false（可选）
---
4. bug修复
---
- 4.1 修复没有摄像头时，voip无法连接的bug
---
v1.1.0 2019/07/8
==
1. SDK功能更新
---
- 1.1 SDK现在允许没有摄像头和麦克风时进入房间观看他人画面或者声音（vdn，src，voip）
- 1.2 SDK目前支持使用接口 StarRtc.StarRoomSDK.createScreenCaptureStream， 创建屏幕分享流
- 1.3 SDK提供超级对讲SDK StarRtc.StarSuperRoomSDK， 半双工模式，允许超大房间自由上麦
- 1.4 SDK StarRtc.StarSDK 现在允许多实例化（实现多用户同时登陆）， 实现超级监控功能（demo中有简单示例）
- 1.5 StarRtc.StarRoomSDK 目前提供自适应加入无chatRoom房间， 进入房间时，传入32位房间id则认为有chat功能， 传入16位房间id则认为没有chat功能
---
2. demo更新
---
- 2.1 demo提供超级对讲功能示例
- 2.2 demo提供超级监控功能示例
- 2.3 demo提供分享视频流功能示例
- 2.4 demo去掉了公有云配置及逻辑代码，增加了开启AEC或关闭AEC时的测试代码
---
3. 新增类和接口
---
- 3.1 类StarRtc.StarSDK（对应之前的StarRtc.Instance，提供多实例化能力）
- 3.2 类StarRtc.StarVideoRoomSDK， videoSDK简单封装
- 3.3 类StarRtc.StarChatRoomSDK， chatSDK简单封装
- 3.4 类StarRtc.StarSuperRoomSDK， 超级对讲SDK
- 3.5 类StarRtc.StarConfig， 配置
- 3.6 类StarRtc.StarUserInfo， 用户信息
- 3.7 接口StarRtc.StarSDK.setConfigUseAEC
- 3.8 接口StarRtc.StarSDK.getVideoRoomSDK
- 3.9 接口StarRtc.StarSDK.getChatRoomSDK
- 3.10 接口StarRtc.StarSDK.getSuperRoomSDK
- 3.11 接口StarRtc.StarRoomSDK.createScreenCaptureStream， StarRtc.StarVideoSDK.createScreenCaptureStream
- 3.12 接口StarRtc.StarVideoSDK.createNewSuperRoom
---
4. 接口变更
---
- 4.1 StarRtc.StarSDK.login 方法去掉了 authKey 参数
- 4.2 StarRtc.StarSDK.reportRoom
- 4.3 StarRtc.StarSDK.delRoom
- 4.4 StarRtc.StarSDK.queryRoom
- 4.5 StarRtc.StarRoomSDK构造函数
- 4.6 StarRtc.StarVideoSDK构造函数
- 4.7 StarRtc.StarChatSDK构造函数
---
5. 废弃类和接口，demo废弃代码
---
- 5.1 类StarRtc.Instance， 目前已经被StarRtc.StarSDK 代替，demo中为提出一种更改最少的方式， 目前令StarRtc.Instance = new StarRtc.StarSDK()
- 5.2 setConfigModePulic
- 5.3 接口StarRtc.StarRoomSDK.login
- 5.4 接口StarRtc.StarVideoSDK.login
- 5.5 接口StarRtc.StarChatSDK.login
- 5.6 接口StarRtc.Instance.setLoginServerUrl 
- 5.7 接口StarRtc.Instance.setMsgScheduleUrl 
- 5.8 接口StarRtc.Instance.setChatRoomScheduleUrl 
- 5.9 接口StarRtc.Instance.setSrcScheduleUrl 
- 5.10 接口StarRtc.Instance.setVdnScheduleUrl 
- 5.11 接口StarRtc.Instance.setVoipServerUrl 
- 5.12 接口StarRtc.Instance.setWorkServerUrl 
- 5.13 接口StarRtc.Instance.setWebrtcServerIP 
- 5.14 接口StarRtc.Instance.setConfigModePulic
- 5.15 接口StarRtc.Instance..queryVideoClassRoom 
- 5.16 接口StarRtc.Instance..queryChatRoom
- 5.17 接口StarRtc.Instance..queryVideoMeetingRoom 
- 5.18 接口StarRtc.Instance..queryVideoLiveRoom 
- 5.20 接口StarRtc.Instance..querySuperTalkRoom 
- 5.21 接口StarRtc.Instance.reportSuperTalkRoom 
- 5.22 接口StarRtc.Instance.reportVideoMeetingRoom 
- 5.23 接口StarRtc.Instance.reportVideoLiveRoom 
- 5.24 接口StarRtc.Instance.reportVideoClassRoom 
- 5.25 接口StarRtc.Instance.reportChatRoom 
- 5.26 接口StarRtc.Instance.delSuperTalkRoom 
- 5.27 接口StarRtc.Instance.delVideoMeetingRoom 
- 5.28 接口StarRtc.Instance.delVideoLiveRoom 
- 5.29 接口StarRtc.Instance.delVideoClassRoom 
- 5.30 接口StarRtc.Instance.delChatRoom 
---
6. 已知问题
---
- 6.1 web端听手机端音频音量过小问题
- 6.2 超级对讲创建房间时，创建者会自动显示在页面上的问题
---
v1.0.1 2019/06/14
==
更新sdk，vdn模式下不需要获取摄像头也可以观看画面