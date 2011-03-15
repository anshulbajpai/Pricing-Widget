var BidData = function(){
	this.data = [];
};

BidData.prototype.add = function(data){
	this.data.push(data);
};

BidData.prototype.hasData = function(data){
	return this.data.length > 0;
};

BidData.prototype._getBestPrice = function(){
	var minPrice = Number.MAX_VALUE;
	for(var i = 0; i < this.data.length; i++){
		var currentData = this.data[i];
		if(currentData.hasLowerPriceThan(minPrice))
			minPrice = currentData.price;
	}
	return minPrice;
};

BidData.prototype.hasBetterPriceThan = function(otherBidData){
	return this._getBestPrice() <= otherBidData._getBestPrice();
};

