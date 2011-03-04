var PriceWidgetController = function(urlTemplate, ajaxWrapper, priceWidgets){
	this.urlTemplate = urlTemplate;
	this.ajaxWrapper = ajaxWrapper;
	this.priceWidgets = priceWidgets;
};

PriceWidgetController.prototype.show = function(instrumentId){
	this.instrumentId = instrumentId;
	this.priceWidgets.reset();
	this._getResponse();
};

PriceWidgetController.prototype._getResponse = function(){
	this.ajaxWrapper.sendContinousRequest(this.urlTemplate.randomize().format(this.instrumentId), this._successCallback, this);
};

PriceWidgetController.prototype._successCallback = function(response){	
	var trimmedText = response.trim();
	if (trimmedText.length > 0)
	{
		var instrumentIdFromResponse = trimmedText.split('|')[0];
		if(this.instrumentId == instrumentIdFromResponse){
			this.priceWidgets.update(trimmedText);	
		}
	}	
};