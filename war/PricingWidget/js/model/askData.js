var AskData = function(){
	this.data = [];
};

AskData.prototype.add = function(data){
	this.data.push(data);
};

AskData.prototype.hasData = function(data){
	return this.data.length > 0;
};

AskData.prototype._getBestPrice = function(){
	var maxPrice = 0;
	for(var i = 0; i < this.data.length; i++){
		var currentData = this.data[i];
		if(currentData.hasHigherPriceThan(maxPrice))
			maxPrice = currentData.price;
	}
	return maxPrice;
};

AskData.prototype.hasBetterPriceThan = function(otherAskData){
	return this._getBestPrice() >= otherAskData._getBestPrice();
};