var AskData = function(){
	this.data = [];
};

AskData.prototype.add = function(data){
	this.data.push(data);
};

AskData.prototype.hasData = function(){
	return this.data.length > 0;
};

AskData.prototype._getBestPriceData = function(){
	return this.hasData() ? this.data[this.data.length - 1] : new PriceData(0, 0);
};

AskData.prototype.hasBetterPriceThan = function(otherAskData){
	return this._getBestPriceData().hasHigherPriceThan(otherAskData._getBestPriceData());
};