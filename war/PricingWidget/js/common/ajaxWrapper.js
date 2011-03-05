var AjaxWrapper = function(){
	this.timerId = -1;
};

AjaxWrapper.prototype.sendContinousRequest = function(url, successCallBack, callerReference){	
	if (-1 != this.timerId)
	{
		clearTimeout(this.timerId);
	}
	this._sendContinousRequest(url, successCallBack, callerReference);
};

AjaxWrapper.prototype._sendContinousRequest = function(url, successCallBack, callerReference){	
	var that = this;
	$.ajax({
		   url:        '../priceWidget?url=' + url,
		   type:       "GET",
		   dataType:   "text",
		   complete: function(xhr){
				if (-1 != that.timerId)
				{
					clearTimeout(that.timerId);
				}
				that.timerId = setTimeout(function(){
		    		   that._sendContinousRequest(url, successCallBack, callerReference);
		    	},1000);		       
		   },
		   success:    function(data){
			   successCallBack.call(callerReference, data);
		   }		   
	});
	
};