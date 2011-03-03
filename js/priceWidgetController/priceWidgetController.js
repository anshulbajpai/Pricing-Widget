var PriceWidgetController = function(urlTemplate, ajaxWrapper, priceWidgets){
	this.urlTemplate = urlTemplate;
	this.ajaxWrapper = ajaxWrapper;
	this.priceWidgets = priceWidgets;
};

PriceWidgetController.prototype.show = function(instrumentId, instrumentName){
	this._instrumentName = instrumentName;
	this._getResponseFor(instrumentId);
	this.priceWidgets.reset();
};

PriceWidgetController.prototype._getResponseFor = function(instrumentId){
	this.ajaxWrapper.sendContinousRequest(this.urlTemplate.randomize().format(instrumentId), "", this._successCallback, this);
};

PriceWidgetController.prototype._successCallback = function(response){
	this.priceWidgets.update(response);
};