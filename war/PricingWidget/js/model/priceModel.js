var PriceModel = function(title, bidData, askData){
	this.title = title;	
	this.bidData = bidData;
	this.askData = askData;
};

PriceModel.prototype.hasBetterBidPriceThan = function(bidData){
	return this.bidData.hasBetterPriceThan(bidData);
};

PriceModel.prototype.hasBetterAskPriceThan = function(askData){
	return this.askData.hasBetterPriceThan(askData);
};