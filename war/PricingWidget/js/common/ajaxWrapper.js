var AjaxWrapper = function(){
	this.sendCallbackTimerId = -1;
	this.canFireRequest = false;
	this.xhr = null;
};

AjaxWrapper.prototype.sendContinousRequest = function(urlTemplate, successCallBack, callerReference){
	this.canFireRequest = true;
	this.urlTemplate = urlTemplate;
	this._sendContinousRequest(this.urlTemplate.randomize().value(), successCallBack, callerReference);
};

AjaxWrapper.prototype._sendContinousRequest = function(url, successCallBack, callerReference){	
	var that = this;
	this.xhr = createXmlHttpRequest();
	this.xhr.open("GET", '../priceWidget?url=' + url, true);
	this.xhr.onreadystatechange = function(){
		that._executeCallback(successCallBack, callerReference, that);   
	};		  
	this.xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	this.xhr.send("");
};

AjaxWrapper.prototype.stopContinousRequest = function(url, successCallBack, callerReference){
	this.canFireRequest = false;
	clearTimeout(this.sendCallbackTimerId);
};

AjaxWrapper.prototype._createXmlHttpRequest = function(){
	if (window.XMLHttpRequest)
	{
		return new window.XMLHttpRequest();
	}

	try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {}

	alert("XMLHttpRequest not supported");

	return null;
};

AjaxWrapper.prototype._executeCallback = function(successCallBack, callerReference){
	var that = this;
	if (!this.xhr || 4 != this.xhr.readyState)
	{
		return;
	}

	if (200 == this.xhr.status)
	{
		var trimmedText = this.xhr.responseText.trim();
		if (trimmedText.length > 0)
		{
			successCallBack.call(callerReference, trimmedText);
		}
	}
	else
	{
		this.xhr.onreadystatechange = null;

		if (-1 != this.sendCallbackTimerId)
		{
			clearTimeout(this.sendCallbackTimerId);
		}

		this.sendCallbackTimerId = setTimeout(new function()
		{
			window.location.reload();
		}, 1000);
	}

	this.xhr.onreadystatechange = null;

	if (-1 != this.sendCallbackTimerId)
	{
		clearTimeout(this.sendCallbackTimerId);
	}
	
	this.sendCallbackTimerId = setTimeout(function(){
			if(that.canFireRequest) {
				that._sendContinousRequest(that.urlTemplate.randomize().value(), successCallBack, callerReference);
			}
		},100);	
};
