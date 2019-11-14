# webrtc-demo
[English Version](README_English.md "Endlish Version")
==
在线效果演示： https://www.starrtc.com/demo/web/

本地测试可以直接拖到浏览器里。 放在服务器上需要web服务器支持https才行（没有https，没法使用webrtc api，这是谷歌定的 ）

部署https方法（有备案好的域名和正规证书的情况下）：http://www.elesos.com/index.php?title=Nginx%E9%85%8D%E7%BD%AEHTTPS

没有正规证书时：

本产品完全免费，并且提供免费的私有部署服务端程序，支持全部功能，并提供第三方拉流、推流功能。

需要我们支持请加QQ群：807242783

如需私有部署，请到如下地址下载：

https://github.com/starrtc/starrtc-server


部署好私有服务端后，请在[index.js](index.js)中，修改privateURL、webrtcIP两个变量指向部署的私有服务端地址，此两个变量意义相同，区别为privateURL可以为域名或ip，webrtcIP必须为ip。

更改完成后，如没有更换过私有服务端目录下自带的自签名证书，可能会遇到wss连接错误

![](https://raw.githubusercontent.com/elesos/assets/master/work/web-1.png)

遇到这种情况需先在浏览器中访问
https://私有服务ip:29991-29995
五个端口，遇到页面提示有风险时，点击继续访问直到出现页面，此操作是用于在websocket wss连接时做证书信任操作，如果有正式证书，可将服务端目录下自签名证书同名替换掉，即可省略此步骤。

在线教育
==
pdf文档上传标记直播，白板

![edu_pdf](assets/edu_pdf.jpg)

![edu_whiteboard](assets/edu_whiteboard.jpg)

录屏
==

![screen_phone](assets/screen_phone.jpg)

![screen_web](assets/screen_web.jpg)


更新记录
===
https://github.com/starrtc/starrtc-web-demo/wiki/Changelog

Contact
=====
QQ ： 2162-498-688

邮箱：<a href="mailto:support@starRTC.com">support@starRTC.com</a>

手机: 186-1294-6552

微信：starRTC

QQ群：807242783
