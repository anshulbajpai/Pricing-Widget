var PricingDataParser = function(){};

PricingDataParser.prototype.createPricingModelFrom = function(response){
	var parsedResponse = this._getParsedResponseFrom(response);
	var bidData =  this._createTradeDataFrom(parsedResponse[1]);
	var askData = this._createTradeDataFrom(parsedResponse[2]);
	return new PriceModel(parsedResponse[0], bidData, askData);
};

PricingDataParser.prototype._getParsedResponseFrom = function(response){
	return response.split('|').slice(2);
};

PricingDataParser.prototype._createTradeDataFrom = function(tradeDataResponse, isBidStep){
	var splittedTradeDataResponse = tradeDataResponse.split(';');
	var tradeData = [];
	for(var i = 0; i < splittedTradeDataResponse.length ; i++){	
		var priceData = splittedTradeDataResponse[i].split('@');
		tradeData.push(new PriceData(parseInt(priceData[0]),parseFloat(priceData[1])));
	}
	return tradeData;
};