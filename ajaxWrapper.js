var AjaxWrapper = function(){};

AjaxWrapper.prototype.sendRequest = function(url, successCallBack, postParameters){
	var xhr = this._createXmlHttpRequest();
	xhr.open("POST", url, true);
	xhr.onreadystatechange = function(){
		if (4 != xhr.readyState)
			return;
		if (200 == xhr.status)
		{
			successCallBack(xhr.responseText);
		}			
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