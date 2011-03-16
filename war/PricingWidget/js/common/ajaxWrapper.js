var AjaxWrapper = function(){
	this.timerId = -1;
	this.canFireRequest = false;
};

AjaxWrapper.prototype.sendContinousRequest = function(urlTemplate, successCallBack, callerReference){
	this.canFireRequest = true;
	this.urlTemplate = urlTemplate;
	this._sendContinousRequest(this.urlTemplate.randomize().withoutBlock().value(), successCallBack, callerReference);
};

AjaxWrapper.prototype._sendContinousRequest = function(url, successCallBack, callerReference){	
	var that = this;
	$.ajax({
		   url:        '../priceWidget?url=' + url,
		   type:       "GET",
		   dataType:   "text",
		   complete: function(xhr){
				that.timerId = setTimeout(function(){
					if(that.canFireRequest) {
						that._sendContinousRequest(that.urlTemplate.randomize().value(), successCallBack, callerReference);
					}
		    	},100);		       
		   },
		   success:    function(data){
			   successCallBack.call(callerReference, data);
		   }		   
	});	
};

AjaxWrapper.prototype.stopContinousRequest = function(url, successCallBack, callerReference){
	this.canFireRequest = false;
	clearTimeout(this.timerId);
};