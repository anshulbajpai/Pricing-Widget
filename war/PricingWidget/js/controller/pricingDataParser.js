var PricingDataParser = function(){};

PricingDataParser.prototype.createPricingModelFrom = function(response){
	var parsedResponse = this._getParsedResponseFrom(response);
	var bidData =  this._createTradeDataFrom(parsedResponse[1], true);
	var askData = this._createTradeDataFrom(parsedResponse[2], false);
	return new PriceModel(parsedResponse[0], bidData, askData);
};

PricingDataParser.prototype._getParsedResponseFrom = function(response){
	return response.split('|').slice(2);
};

PricingDataParser.prototype._createTradeDataFrom = function(tradeDataResponse, isBidStep){
	var splittedTradeDataResponse = isBidStep ? tradeDataResponse.split(';') : tradeDataResponse.split(';').reverse();
	var tradeData = isBidStep ? new BidData() : new AskData();
	for(var i = 0; i < splittedTradeDataResponse.length ; i++){	
		var priceData = splittedTradeDataResponse[i].split('@');
		tradeData.add(new PriceData(parseInt(priceData[0]),parseFloat(priceData[1])));
	}
	return tradeData;
};