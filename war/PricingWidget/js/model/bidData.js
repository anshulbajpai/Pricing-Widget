var BidData = function(){
	this.data = [];
};

BidData.prototype.add = function(data){
	this.data.push(data);
};

BidData.prototype.hasData = function(){
	return this.data.length > 0;
};

BidData.prototype._getBestPriceData = function(){
	return this.hasData() ? this.data[0] : new PriceData(0, Number.MAX_VALUE);
};

BidData.prototype.hasBetterPriceThan = function(otherBidData){
	return this._getBestPriceData().hasLowerPriceThan(otherBidData._getBestPriceData());
};