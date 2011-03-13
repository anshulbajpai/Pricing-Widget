var PriceModel = function(title, bidData, askData){
	this.title = title;	
	this.bidData = bidData;
	this.askData = askData;
};

PriceModel.prototype.getBetterBidData = function(otherBidData){
	return this.bidData.hasBetterPriceThan(otherBidData) ? this.bidData : otherBidData || this.bidData;
};

PriceModel.prototype.getBetterAskData = function(otherAskData){
	return this.askData.hasBetterPriceThan(otherAskData) ? this.askData : otherAskData || this.askData;
};