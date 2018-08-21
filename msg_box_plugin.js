var MyMsgWindow = function(id, _inputMsgCallBack)
{
	this.id = id;
	this.userName = "unnamed";
	this.inputMsgCallBack = _inputMsgCallBack;
	this.showSpeed = 0;
	this.showCallback = null;
	this.hideSpeed = 0;
	this.hideCallBack = null;
	
	this.parentObj = $("#"+id);
	this.exitButton = $("<div style=\"width:25px;height:25px;position:absolute;left:10px;top:10px;background-image: url(images/exitMsgWindow.jpg);background-size: cover;cursor:pointer;z-index:1;\"></div>");
	this.msgContent = $("<div style=\"width:100%;height:90%;overflow:auto;position:relative;background-color:#ffffff\" ></div>");
	this.msgInputWrapper = $("<div style=\"width:100%;height:10%;\" ></div>");
	this.msgInput = $("<input type=\"text\" style=\"width: 100%;height: 100%;background: whitesmoke;padding: 0;border-width: 0;text-align: left\"  placeholder=\"点击这里 输入消息\" />");
	var that = this;
	
	this.msgInput.bind("keydown", function(evt){
		if(evt.keyCode==13)
		{
			if(evt.target.value != "")
			{
				that.displayMessage(that.userName ,evt.target.value, true);
				if(that.inputMsgCallBack != null)
				{
					that.inputMsgCallBack(evt.target.value);
				}
				evt.target.value = "";
			}
		}
	});
	
	this.exitButton.bind("click", function(evt){
		that.hide();
	});
	
	this.msgInputWrapper.append(this.msgInput);
	
	this.parentObj.append(this.exitButton);
	this.parentObj.append(this.msgContent);
	this.parentObj.append(this.msgInputWrapper);
	
	MyMsgWindow.prototype.displayMessage = function(displayname, msg, flag)
	{
		var name = flag?(":" + displayname):(displayname + ":");
		var floatDir = flag?"right":"left";
		var bgColor = flag?"#088cb7":"red";
		var msg = $("<div style='width:100%;font-size:10px;clear:both;'><div style='text-align:right;float:" + floatDir + ";padding:5px;margin:5px auto 5px auto;'>" + name + "</div><div class = 'msgBubble' style='max-width:60%;float:" + floatDir + ";background:" + bgColor + ";'>" + msg + "</div></div>");
		this.msgContent.append(msg);
		this.msgContent.scrollTop( this.msgContent[0].scrollHeight );
	}
	
	MyMsgWindow.prototype.setShowHideCallBack = function(showSpeed, showCallback, hideSpeed, hideCallBack)
	{
		this.showSpeed = showSpeed;
		this.showCallback = showCallback;
		this.hideSpeed = hideSpeed;
		this.hideCallBack = hideCallBack;
	}
	
	MyMsgWindow.prototype.show = function()
	{
		this.parentObj.slideDown(this.showSpeed, this.showCallback);
	}
	
	MyMsgWindow.prototype.hide = function()
	{
		this.parentObj.slideUp(this.hideSpeed, this.hideCallBack);
	}
	
	return this;
} 