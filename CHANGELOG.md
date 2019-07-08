2019.7.8更新里程碑版本1.1.0
==
1. SDK功能更新
---
1.1 SDK现在允许没有摄像头和麦克风时进入房间观看他人画面或者声音（vdn，src，voip）
1.2 SDK目前支持使用接口 StarRtc.StarRoomSDK.createScreenCaptureStream， 创建屏幕分享流
1.3 SDK提供超级对讲SDK StarRtc.StarSuperRoomSDK， 半双工模式，允许超大房间自由上麦
1.4 SDK StarRtc.StarSDK 现在允许多实例化（实现多用户同时登陆）， 实现超级监控功能（demo中有简单示例）
1.5 StarRtc.StarRoomSDK 目前提供自适应加入无chatRoom房间， 进入房间时，传入32位房间id则认为有chat功能， 传入16位房间id则认为没有chat功能
2. demo更新
---
2.1 demo提供超级对讲功能示例
2.2 demo提供超级监控功能示例
2.3 demo提供分享视频流功能示例
2.4 demo去掉了公有云配置及逻辑代码，增加了开启AEC或关闭AEC时的测试代码
3. 新增类和接口
---
3.1 类StarRtc.StarSDK（对应之前的StarRtc.Instance，提供多实例化能力）
3.2 类StarRtc.StarVideoRoomSDK， videoSDK简单封装
3.3 类StarRtc.StarChatRoomSDK， chatSDK简单封装
3.4 类StarRtc.StarSuperRoomSDK， 超级对讲SDK
3.5 类StarRtc.StarConfig， 配置
3.6 类StarRtc.StarUserInfo， 用户信息
3.7 接口StarRtc.StarSDK.setConfigUseAEC
3.8 接口StarRtc.StarSDK.getVideoRoomSDK
3.9 接口StarRtc.StarSDK.getChatRoomSDK
3.10 接口StarRtc.StarSDK.getSuperRoomSDK
3.11 接口StarRtc.StarRoomSDK.createScreenCaptureStream， StarRtc.StarVideoSDK.createScreenCaptureStream
3.12 接口StarRtc.StarVideoSDK.createNewSuperRoom
4. 接口变更
---
4.1 StarRtc.StarSDK.login 方法去掉了 authKey 参数
4.2 StarRtc.StarSDK.reportRoom
4.3 StarRtc.StarSDK.delRoom
4.4 StarRtc.StarSDK.queryRoom
4.5 StarRtc.StarRoomSDK构造函数
4.6 StarRtc.StarVideoSDK构造函数
4.7 StarRtc.StarChatSDK构造函数
5. 废弃类和接口，demo废弃代码
---
5.1 类StarRtc.Instance， 目前已经被StarRtc.StarSDK 代替，demo中为提出一种更改最少的方式， 目前令StarRtc.Instance = new StarRtc.StarSDK()
5.2 setConfigModePulic
5.3 接口StarRtc.StarRoomSDK.login
5.4 接口StarRtc.StarVideoSDK.login
5.5 接口StarRtc.StarChatSDK.login
5.6 接口StarRtc.Instance.setLoginServerUrl 
5.7 接口StarRtc.Instance.setMsgScheduleUrl 
5.8 接口StarRtc.Instance.setChatRoomScheduleUrl 
5.9 接口StarRtc.Instance.setSrcScheduleUrl 
5.10 接口StarRtc.Instance.setVdnScheduleUrl 
5.11 接口StarRtc.Instance.setVoipServerUrl 
5.12 接口StarRtc.Instance.setWorkServerUrl 
5.13 接口StarRtc.Instance.setWebrtcServerIP 
5.14 接口StarRtc.Instance.setConfigModePulic
5.15 接口StarRtc.Instance..queryVideoClassRoom 
5.16 接口StarRtc.Instance..queryChatRoom
5.17 接口StarRtc.Instance..queryVideoMeetingRoom 
5.18 接口StarRtc.Instance..queryVideoLiveRoom 
5.20 接口StarRtc.Instance..querySuperTalkRoom 
5.21 接口StarRtc.Instance.reportSuperTalkRoom 
5.22 接口StarRtc.Instance.reportVideoMeetingRoom 
5.23 接口StarRtc.Instance.reportVideoLiveRoom 
5.24 接口StarRtc.Instance.reportVideoClassRoom 
5.25 接口StarRtc.Instance.reportChatRoom 
5.26 接口StarRtc.Instance.delSuperTalkRoom 
5.27 接口StarRtc.Instance.delVideoMeetingRoom 
5.28 接口StarRtc.Instance.delVideoLiveRoom 
5.29 接口StarRtc.Instance.delVideoClassRoom 
5.30 接口StarRtc.Instance.delChatRoom 
4. 已知问题
---
4.1 web端听手机端音频音量过小问题
4.2 超级对讲创建房间时，创建者会自动显示在页面上的问题
2019.6.14更新版本1.0.1
==
更新sdk，vdn模式下不需要获取摄像头也可以观看画面