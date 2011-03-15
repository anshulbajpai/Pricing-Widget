var AjaxWrapper = function(){
	this.timerId = -1;
	this.canFireRequest = false;
};

AjaxWrapper.prototype.sendContinousRequest = function(urlTemplate, successCallBack, callerReference){
	this.canFireRequest = true;
	this._sendContinousRequest(urlTemplate, successCallBack, callerReference);
};

AjaxWrapper.prototype._sendContinousRequest = function(urlTemplate, successCallBack, callerReference){	
	var that = this;
	$.ajax({
		   url:        '../priceWidget?url=' + urlTemplate.randomize().value(),
		   type:       "GET",
		   dataType:   "text",
		   complete: function(xhr){
				that.timerId = setTimeout(function(){

						if(that.canFireRequest) {
							console.log("timerId", that.timerId);
							that._sendContinousRequest(urlTemplate, successCallBack, callerReference);
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