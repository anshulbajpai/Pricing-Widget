var PriceWidgetController = function(urlTemplate, ajaxWrapper, priceWidgets){
	this.urlTemplate = urlTemplate;
	this.ajaxWrapper = ajaxWrapper;
	this.priceWidgets = priceWidgets;
};

PriceWidgetController.prototype.show = function(instrumentId){
	this.priceWidgets.reset();
	this._getResponseFor(instrumentId);
};

PriceWidgetController.prototype._getResponseFor = function(instrumentId){
	this.ajaxWrapper.sendContinousRequest(function(){
		return this.urlTemplate.randomize().format(instrumentId);
	}, "", this._successCallback, this);
};

PriceWidgetController.prototype._successCallback = function(response){
	this.priceWidgets.update(response);
};