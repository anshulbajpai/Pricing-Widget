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
};

PriceWidgetController.prototype._getResponse = function(){
	this.ajaxWrapper.sendContinousRequest(this.urlTemplate.randomize().value(), this._successCallback, this);
};

PriceWidgetController.prototype._successCallback = function(response){	
	var trimmedText = response.trim();
	if (trimmedText.length > 0)
	{
		var instrumentResponse =  this._getInstrumentResponse(trimmedText);
		var currentPricingModel = this.pricingDataParser.createPricingModelFrom(instrumentResponse);
		this.priceDataContainer.add(currentPricingModel);		
	}	
};


PriceWidgetController.prototype._getInstrumentResponse = function(response){	
	var allInstruments = response.split('\n');
	for(var i=0; i < allInstruments.length; i++){
		if(allInstruments[i].split('|')[0] == this.instrumentId){
			return allInstruments[i];			
		}
	}
};
