var PriceWidgetController = function(urlTemplate, ajaxWrapper, pricingDataParser, priceWidgets){
	var that = this;
	this.urlTemplate = urlTemplate;
	this.ajaxWrapper = ajaxWrapper;
	this.pricingDataParser = pricingDataParser;
	this.priceWidgets = priceWidgets;
	this.priceDataContainer = new PriceDataContainer(function(pricingModel){that.priceWidgets.update(pricingModel);}, this);
};

PriceWidgetController.prototype.show = function(instrumentId){
	this.instrumentId = instrumentId;
	this.priceDataContainer.reset();
	this.priceWidgets.reset();
	this._getResponse();	
};

PriceWidgetController.prototype._getResponse = function(){
	this.ajaxWrapper.sendContinousRequest(this.urlTemplate.randomize().format(this.instrumentId).value(), this._successCallback, this);
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