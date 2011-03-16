var PriceWidgetController = function(urlTemplate, ajaxWrapper, pricingDataParser, priceWidgets){
	var that = this;
	this.urlTemplate = urlTemplate;
	this.ajaxWrapper = ajaxWrapper;
	this.pricingDataParser = pricingDataParser;
	this.priceWidgets = priceWidgets;
	this.priceDataContainer = new PriceDataContainer(this._updateWidgets, this);
};

PriceWidgetController.prototype._updateWidgets = function(pricingModel){
	this.priceWidgets.update(pricingModel);
};

PriceWidgetController.prototype.show = function(instrumentId){
	this.instrumentId = instrumentId;
	this.priceDataContainer.reset();	
	this.priceWidgets.reset();
	this._getResponse();
	this.priceDataContainer.init();
};

PriceWidgetController.prototype.reset = function() {
	this.ajaxWrapper.stopContinousRequest();
	this.priceDataContainer.reset();
	this.priceWidgets.reset();
}

PriceWidgetController.prototype._getResponse = function(){
	this.ajaxWrapper.sendContinousRequest(this.urlTemplate.format(this.instrumentId), this._successCallback, this);
};

PriceWidgetController.prototype._successCallback = function(response){	
	var trimmedText = response.trim();
	if (trimmedText.length > 0)
	{
		var instrumentIdFromResponse = trimmedText.split('|')[0];
		if(this.instrumentId == instrumentIdFromResponse){
			var currentPricingModel = this.pricingDataParser.createPricingModelFrom(trimmedText);
			this.priceDataContainer.add(currentPricingModel);				
		}	
	}	
};

