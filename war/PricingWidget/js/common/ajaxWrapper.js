var AjaxWrapper = function(){
	this.isTimerRunning = -1;
};

AjaxWrapper.prototype.sendContinousRequest = function(urlProvider, postParameters, successCallBack, callerReference){
	var xhr = this._createXmlHttpRequest();
	var url = urlProvider.call(callerReference);
	xhr.open("GET", '../priceWidget?url=' + url, true);
	var that = this;
	xhr.onreadystatechange = function(){
		if (4 != xhr.readyState)
			return;
		if (200 == xhr.status)
		{
			var trimmedText = xhr.responseText.trim();
			if (trimmedText.length > 0)
			{
				successCallBack.call(callerReference, trimmedText);
			}			
		}
		xhr.onreadystatechange = null;
		if (-1 != that.isTimerRunning)
		{
			clearTimeout(that.isTimerRunning);
			that.isTimerRunning = -1;
		}
		that.isTimerRunning = setTimeout(function(){ that.sendContinousRequest(urlProvider, postParameters, successCallBack, callerReference);}, 1000);
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