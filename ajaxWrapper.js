var AjaxWrapper = function(){
	this.isTimerRunning = -1;
};

AjaxWrapper.prototype.sendContinousRequest = function(url, postParameters, successCallBack, callerReference){
	var xhr = this._createXmlHttpRequest();
	xhr.open("POST", url, true);
	var that = this;
	xhr.onreadystatechange = function(){
		if (4 != xhr.readyState)
			return;
		if (200 == xhr.status)
		{
			successCallBack.call(callerReference, xhr.responseText);
		}
		xhr.onreadystatechange = null;
		if (-1 != that.isTimerRunning)
		{
			clearTimeout(that.isTimerRunning);
			that.isTimerRunning = -1;
		}
		that.isTimerRunning = setTimeout(function(){ that.sendContinousRequest(url, postParameters, successCallBack, callerReference);}, 1000);
	};
	xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	xhr.send(postParameters);
};

AjaxWrapper.prototype._createXmlHttpRequest = function()
{
	if (window.XMLHttpRequest)
	{
		return new window.XMLHttpRequest();
	}
	try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch(e) {}
	alert("XMLHttpRequest not supported");
	return null;
};