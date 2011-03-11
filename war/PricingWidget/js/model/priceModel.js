var PriceModel = function(title, bidData, askData){
	this.title = title;	
	this.bidData = bidData;
	this.askData = askData;
};

PriceModel.prototype.hasSameOrLowerBidPriceThan = function(bidData){
	return this.bidData.getLowestBidPrice() <= bidData.getLowestBidPrice();
};
PriceModel.prototype.hasSameOrHigherAskPriceThan = function(askData){
	return this.askData.getHighestAskPrice() >= askData.getHighestAskPrice();
};